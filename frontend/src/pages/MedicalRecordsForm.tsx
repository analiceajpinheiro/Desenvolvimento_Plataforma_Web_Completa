import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  LoadingSpinner,
  Modal,
  Navbar,
  PrescriptionCard,
  PrescriptionForm,
  Select,
} from '../components';
import { PrescriptionFormValues } from '../components/PrescriptionForm';
import { usePatients } from '../hooks/usePatients';
import {
  medicalRecordService,
  CreateMedicalRecordDTO,
  UpdateMedicalRecordDTO,
} from '../services/medicalRecordService';
import { Appointment, User } from '../types';
import { formatDate } from '../utils/validators';
import api from '../services/api';
import {
  prescriptionService,
  Prescription,
} from '../services/prescriptionService';

const TEXTAREA_BASE =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none';
const TEXTAREA_ERROR =
  'w-full px-4 py-2 border border-red-500 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 resize-none';

export const MedicalRecordsForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { patients, fetchPatients } = usePatients();

  const [doctors, setDoctors] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingRecord, setLoadingRecord] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentId: '',
    mainComplaint: '',
    history: '',
    physicalExam: '',
    diagnosis: '',
    treatment: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [prescriptionError, setPrescriptionError] = useState<string | null>(null);
  const [deleteConfirmPrescription, setDeleteConfirmPrescription] = useState<Prescription | null>(null);
  const [isSavingPrescription, setIsSavingPrescription] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    fetchPatients(1);
    loadDoctors();
  }, []);

  // Carregar prontuário existente para edição
  useEffect(() => {
    if (isEditing && id) {
      loadRecord(id);
    }
  }, [id]);

  // Recarregar agendamentos quando paciente muda
  useEffect(() => {
    if (formData.patientId && !isEditing) {
      loadAppointments(formData.patientId);
    }
  }, [formData.patientId]);

  // Carregar prescrições do prontuário ao editar
  useEffect(() => {
    if (isEditing && id) {
      loadPrescriptions(id);
    }
  }, [id]);

  const loadRecord = async (recordId: string) => {
    setLoadingRecord(true);
    try {
      const record = await medicalRecordService.getById(recordId);
      setFormData({
        patientId: record.patientId,
        doctorId: record.doctorId,
        appointmentId: record.appointmentId,
        mainComplaint: record.mainComplaint,
        history: record.history || '',
        physicalExam: record.physicalExam || '',
        diagnosis: record.diagnosis || '',
        treatment: record.treatment || '',
      });
    } catch (err) {
      setFormError('Erro ao carregar prontuário. Verifique se ele ainda existe.');
    } finally {
      setLoadingRecord(false);
    }
  };

  const loadPrescriptions = async (recordId: string) => {
    setLoadingPrescriptions(true);
    try {
      const data = await prescriptionService.getByMedicalRecord(recordId);
      setPrescriptions(data);
    } catch {
      setPrescriptionError('Erro ao carregar prescrições');
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  const loadDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const response = await api.get('/users?role=DOCTOR');
      setDoctors(response.data.data || []);
    } catch (err) {
      console.error('Erro ao carregar médicos:', err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const loadAppointments = async (patientId: string) => {
    setLoadingAppointments(true);
    try {
      const response = await api.get(`/patients/${patientId}/appointments`);
      const apts: Appointment[] = response.data.data || [];
      setAppointments(
        apts.filter(
          (a) => a.status === 'CONFIRMED' || a.status === 'COMPLETED'
        )
      );
      setFormData((prev) => ({ ...prev, appointmentId: '' }));
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err);
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Selecione um paciente';
    }

    if (!formData.doctorId) {
      newErrors.doctorId = 'Selecione um médico';
    }

    if (!isEditing && !formData.appointmentId) {
      newErrors.appointmentId = 'Selecione um agendamento';
    }

    if (!formData.mainComplaint.trim()) {
      newErrors.mainComplaint = 'Queixa principal é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!validateForm()) {
      setFormError('Por favor, corrija os erros no formulário');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && id) {
        const updateData: UpdateMedicalRecordDTO = {
          mainComplaint: formData.mainComplaint,
          history: formData.history || undefined,
          physicalExam: formData.physicalExam || undefined,
          diagnosis: formData.diagnosis || undefined,
          treatment: formData.treatment || undefined,
        };
        await medicalRecordService.update(id, updateData);
        setFormSuccess('Prontuário atualizado com sucesso!');
      } else {
        const createData: CreateMedicalRecordDTO = {
          patientId: formData.patientId,
          doctorId: formData.doctorId,
          appointmentId: formData.appointmentId,
          mainComplaint: formData.mainComplaint,
          history: formData.history || undefined,
          physicalExam: formData.physicalExam || undefined,
          diagnosis: formData.diagnosis || undefined,
          treatment: formData.treatment || undefined,
        };
        await medicalRecordService.create(createData);
        setFormSuccess('Prontuário criado com sucesso!');
      }

      setTimeout(() => navigate('/medical-records'), 1500);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (isEditing ? 'Erro ao atualizar prontuário' : 'Erro ao criar prontuário');
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrescription = async (formValues: PrescriptionFormValues) => {
    if (!id) return;
    setIsSavingPrescription(true);
    setPrescriptionError(null);
    try {
      if (editingPrescription) {
        const updated = await prescriptionService.update(
          editingPrescription.id,
          formValues
        );
        setPrescriptions((prev) =>
          prev.map((p) => (p.id === editingPrescription.id ? updated : p))
        );
      } else {
        const created = await prescriptionService.create(id, {
          ...formValues,
          doctorId: formData.doctorId,
        });
        setPrescriptions((prev) => [created, ...prev]);
      }
      setShowPrescriptionForm(false);
      setEditingPrescription(null);
    } catch (err: any) {
      setPrescriptionError(
        err?.response?.data?.message || 'Erro ao salvar prescrição'
      );
    } finally {
      setIsSavingPrescription(false);
    }
  };

  const handleDeletePrescription = async () => {
    if (!deleteConfirmPrescription) return;
    try {
      await prescriptionService.delete(deleteConfirmPrescription.id);
      setPrescriptions((prev) =>
        prev.filter((p) => p.id !== deleteConfirmPrescription.id)
      );
      setDeleteConfirmPrescription(null);
    } catch (err: any) {
      setPrescriptionError(
        err?.response?.data?.message || 'Erro ao excluir prescrição'
      );
      setDeleteConfirmPrescription(null);
    }
  };

  if (loadingRecord) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="lg" message="Carregando prontuário..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {isEditing ? 'Editar Prontuário' : 'Novo Prontuário'}
        </h1>

        {/* Mensagens */}
        <div className="mb-6 space-y-3">
          {formError && <Alert type="error" message={formError} />}
          {formSuccess && <Alert type="success" message={formSuccess} />}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {/* ── Dados de Identificação (desabilitados ao editar) ── */}
          <Select
            label="Paciente"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            error={errors.patientId}
            options={patients.map((p) => ({
              value: p.id,
              label: `${p.name} (CPF: ${p.cpf})`,
            }))}
            disabled={isEditing}
            required
          />

          <Select
            label="Médico Responsável"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            error={errors.doctorId}
            options={
              loadingDoctors
                ? [{ value: '', label: 'Carregando médicos...' }]
                : doctors.map((d) => ({
                    value: d.id,
                    label: `Dr(a). ${d.name}${
                      d.specialty ? ` — ${d.specialty}` : ''
                    }`,
                  }))
            }
            disabled={loadingDoctors || isEditing}
            required
          />

          {!isEditing && (
            <>
              <Select
                label="Agendamento Relacionado"
                name="appointmentId"
                value={formData.appointmentId}
                onChange={handleChange}
                error={errors.appointmentId}
                options={
                  loadingAppointments
                    ? [{ value: '', label: 'Carregando agendamentos...' }]
                    : appointments.map((a) => ({
                        value: a.id,
                        label: `${formatDate(a.date)}${
                          a.doctor ? ` — Dr(a). ${a.doctor.name}` : ''
                        } (${a.status})`,
                      }))
                }
                disabled={
                  loadingAppointments ||
                  !formData.patientId ||
                  appointments.length === 0
                }
                required
              />

              {formData.patientId &&
                !loadingAppointments &&
                appointments.length === 0 && (
                  <Alert
                    type="warning"
                    message="Nenhum agendamento confirmado encontrado para este paciente"
                  />
                )}
            </>
          )}

          {/* ── Dados Clínicos ── */}
          <div className="border-t border-gray-100 pt-6 mt-2">
            {/* Queixa Principal */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Queixa Principal{' '}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="mainComplaint"
                value={formData.mainComplaint}
                onChange={handleChange}
                placeholder="Descreva a queixa principal do paciente..."
                rows={3}
                className={
                  errors.mainComplaint ? TEXTAREA_ERROR : TEXTAREA_BASE
                }
              />
              {errors.mainComplaint && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mainComplaint}
                </p>
              )}
            </div>

            {/* Histórico */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Histórico{' '}
                <span className="text-gray-400 text-sm font-normal">
                  (Opcional)
                </span>
              </label>
              <textarea
                name="history"
                value={formData.history}
                onChange={handleChange}
                placeholder="Histórico clínico do paciente..."
                rows={3}
                className={TEXTAREA_BASE}
              />
            </div>

            {/* Exame Físico */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Exame Físico{' '}
                <span className="text-gray-400 text-sm font-normal">
                  (Opcional)
                </span>
              </label>
              <textarea
                name="physicalExam"
                value={formData.physicalExam}
                onChange={handleChange}
                placeholder="Resultados do exame físico..."
                rows={3}
                className={TEXTAREA_BASE}
              />
            </div>

            {/* Diagnóstico */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Diagnóstico{' '}
                <span className="text-gray-400 text-sm font-normal">
                  (Opcional)
                </span>
              </label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Diagnóstico do paciente..."
                rows={3}
                className={TEXTAREA_BASE}
              />
            </div>

            {/* Tratamento */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Tratamento{' '}
                <span className="text-gray-400 text-sm font-normal">
                  (Opcional)
                </span>
              </label>
              <textarea
                name="treatment"
                value={formData.treatment}
                onChange={handleChange}
                placeholder="Plano de tratamento recomendado..."
                rows={3}
                className={TEXTAREA_BASE}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 mt-8">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSaving}
              loading={isSaving}
            >
              {isEditing ? 'Atualizar' : 'Criar'} Prontuário
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate('/medical-records')}
              disabled={isSaving}
            >
              Cancelar
            </Button>
          </div>
        </form>

        {/* ── Prescrições (somente ao editar) ── */}
        {isEditing && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Prescrições</h3>
              {!showPrescriptionForm && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setEditingPrescription(null);
                    setShowPrescriptionForm(true);
                  }}
                >
                  + Adicionar Prescrição
                </Button>
              )}
            </div>

            {prescriptionError && (
              <div className="mb-4">
                <Alert
                  type="error"
                  message={prescriptionError}
                  onClose={() => setPrescriptionError(null)}
                />
              </div>
            )}

            {showPrescriptionForm && (
              <div className="mb-4">
                <PrescriptionForm
                  prescription={editingPrescription}
                  onSave={handleSavePrescription}
                  onCancel={() => {
                    setShowPrescriptionForm(false);
                    setEditingPrescription(null);
                  }}
                  isSaving={isSavingPrescription}
                />
              </div>
            )}

            {loadingPrescriptions ? (
              <p className="text-sm text-gray-500">Carregando prescrições...</p>
            ) : prescriptions.length > 0 ? (
              <div className="space-y-3">
                {prescriptions.map((p) => (
                  <PrescriptionCard
                    key={p.id}
                    prescription={p}
                    onEdit={(presc) => {
                      setEditingPrescription(presc);
                      setShowPrescriptionForm(true);
                    }}
                    onDelete={(presc) => setDeleteConfirmPrescription(presc)}
                  />
                ))}
              </div>
            ) : !showPrescriptionForm ? (
              <p className="text-sm text-gray-400 italic">
                Nenhuma prescrição adicionada
              </p>
            ) : null}
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão de prescrição */}
      <Modal
        isOpen={!!deleteConfirmPrescription}
        title="Confirmar Exclusão"
        onClose={() => setDeleteConfirmPrescription(null)}
        onConfirm={handleDeletePrescription}
        confirmVariant="danger"
        confirmText="Excluir"
      >
        <p className="text-gray-700">
          Tem certeza que deseja excluir a prescrição de{' '}
          <strong>{deleteConfirmPrescription?.medication}</strong>? Esta ação
          não pode ser desfeita.
        </p>
      </Modal>
    </div>
  );
};
