import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Input,
  Navbar,
  Select,
  LoadingSpinner,
} from '../components';
import { useAppointments } from '../hooks/useAppointments';
import { usePatients } from '../hooks/usePatients';
import { Appointment, Patient, User, AppointmentStatus } from '../types';
import api from '../services/api';

export const AppointmentsForm: React.FC = () => {
  const navigate = useNavigate();
  const { addAppointment, loading: appointmentLoading } = useAppointments();
  const { patients, fetchPatients } = usePatients();

  const [doctors, setDoctors] = useState<User[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Carregar pacientes e médicos
  useEffect(() => {
    fetchPatients(1);
    loadDoctors();
  }, []);

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

  const loadAvailableSlots = async () => {
    if (!formData.doctorId || !formData.date) return;

    setLoadingSlots(true);
    try {
      const response = await api.get(
        `/doctors/${formData.doctorId}/available-slots?date=${formData.date}`
      );
      setAvailableSlots(response.data.data || []);
      setFormData((prev) => ({ ...prev, time: '' }));
    } catch (err) {
      console.error('Erro ao carregar slots disponíveis:', err);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Carregar slots ao mudar data ou médico
    if (name === 'doctorId' || name === 'date') {
      const newFormData = { ...formData, [name]: value };
      if (newFormData.doctorId && newFormData.date) {
        setTimeout(() => {
          loadAvailableSlots();
        }, 300);
      }
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

    if (!formData.date) {
      newErrors.date = 'Selecione uma data';
    }

    if (!formData.time) {
      newErrors.time = 'Selecione um horário';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      setFormError('Por favor, corrija os erros no formulário');
      return;
    }

    setIsSaving(true);
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      await addAppointment({
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        date: dateTime.toISOString(),
        notes: formData.notes || undefined,
      });

      navigate('/appointments');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao agendar consulta';
      setFormError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Novo Agendamento</h1>

        {/* Mensagens */}
        {formError && (
          <div className="mb-6">
            <Alert type="error" message={formError} />
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {/* Paciente */}
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
            required
          />

          {/* Médico */}
          <Select
            label="Médico"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            error={errors.doctorId}
            options={
              loadingDoctors
                ? [{ value: '', label: 'Carregando médicos...' }]
                : doctors.map((d) => ({
                    value: d.id,
                    label: `Dr(a). ${d.name}${d.specialty ? ` - ${d.specialty}` : ''}`,
                  }))
            }
            disabled={loadingDoctors}
            required
          />

          {/* Data */}
          <Input
            label="Data"
            name="date"
            type="date"
            min={minDate}
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            required
          />

          {/* Horário */}
          {loadingSlots ? (
            <div className="py-3">
              <LoadingSpinner size="sm" message="Carregando horários disponíveis..." />
            </div>
          ) : (
            <Select
              label="Horário"
              name="time"
              value={formData.time}
              onChange={handleChange}
              error={errors.time}
              options={availableSlots.map((slot) => ({
                value: slot,
                label: slot,
              }))}
              disabled={availableSlots.length === 0}
              required
            />
          )}

          {availableSlots.length === 0 && formData.date && formData.doctorId && !loadingSlots && (
            <Alert
              type="warning"
              message="Nenhum horário disponível para o médico nesta data"
            />
          )}

          {/* Notas */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Notas (Opcional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Ex: Consulta de acompanhamento"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
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
              Agendar Consulta
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate('/appointments')}
              disabled={isSaving}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
