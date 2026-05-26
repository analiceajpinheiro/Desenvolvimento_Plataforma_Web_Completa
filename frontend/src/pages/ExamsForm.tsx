import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Input, Navbar, Select, LoadingSpinner } from '../components';
import { useExams } from '../hooks/useExams';
import { ExamStatus, ExamType } from '../types';

interface ExamFormData {
  name: string;
  type: ExamType;
  description: string;
  result: string;
  status: ExamStatus;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
}

const initialForm: ExamFormData = {
  name: '',
  type: ExamType.LAB,
  description: '',
  result: '',
  status: ExamStatus.REQUESTED,
  patientId: '',
  doctorId: '',
  scheduledAt: '',
};

export const ExamsForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { exams, loading, error, addExam, updateExam, fetchExams } = useExams();

  const [formData, setFormData] = useState<ExamFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchExams(1);
    }
  }, [id]);

  useEffect(() => {
    if (id && exams.length > 0) {
      const exam = exams.find((e) => e.id === id);
      if (exam) {
        setFormData({
          name: exam.name,
          type: exam.type,
          description: exam.description ?? '',
          result: exam.result ?? '',
          status: exam.status,
          patientId: exam.patientId,
          doctorId: exam.doctorId,
          scheduledAt: exam.scheduledAt ? exam.scheduledAt.split('T')[0] : '',
        });
      }
    }
  }, [id, exams]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome do exame é obrigatório';
    if (!formData.patientId.trim()) newErrors.patientId = 'ID do paciente é obrigatório';
    if (!formData.doctorId.trim()) newErrors.doctorId = 'ID do médico é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
      const payload = {
        ...formData,
        scheduledAt: formData.scheduledAt || undefined,
      };

      if (id) {
        await updateExam(id, payload);
        setFormSuccess('Exame atualizado com sucesso!');
      } else {
        await addExam(payload as any);
        setFormSuccess('Exame criado com sucesso!');
        setFormData(initialForm);
      }

      setTimeout(() => navigate('/exams'), 1500);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar exame');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {id ? 'Editar Exame' : 'Novo Exame'}
        </h1>

        <div className="mb-6 space-y-3">
          {formError && <Alert type="error" message={formError} />}
          {formSuccess && <Alert type="success" message={formSuccess} />}
          {error && <Alert type="error" message={error} />}
        </div>

        {loading && !id ? (
          <LoadingSpinner message="Carregando..." />
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Nome do Exame"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Ex: Hemograma Completo"
                  required
                />
              </div>

              <Select
                label="Tipo de Exame"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                  { value: ExamType.LAB, label: 'Laboratorial' },
                  { value: ExamType.IMAGE, label: 'Imagem' },
                  { value: ExamType.FUNCTIONAL, label: 'Funcional' },
                  { value: ExamType.OTHER, label: 'Outro' },
                ]}
              />

              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: ExamStatus.REQUESTED, label: 'Solicitado' },
                  { value: ExamStatus.SCHEDULED, label: 'Agendado' },
                  { value: ExamStatus.IN_PROGRESS, label: 'Em Andamento' },
                  { value: ExamStatus.COMPLETED, label: 'Concluído' },
                  { value: ExamStatus.CANCELLED, label: 'Cancelado' },
                ]}
              />

              <Input
                label="ID do Paciente"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                error={errors.patientId}
                placeholder="ID do paciente"
                required
              />

              <Input
                label="ID do Médico"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                error={errors.doctorId}
                placeholder="ID do médico"
                required
              />

              <Input
                label="Data de Agendamento"
                name="scheduledAt"
                type="date"
                value={formData.scheduledAt}
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrição do exame (opcional)"
                />
              </div>

              {id && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resultado</label>
                  <textarea
                    name="result"
                    value={formData.result}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Resultado do exame"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <Button type="submit" variant="primary" size="lg" disabled={isSaving} loading={isSaving}>
                {id ? 'Atualizar' : 'Criar'} Exame
              </Button>
              <Button type="button" variant="secondary" size="lg" onClick={() => navigate('/exams')} disabled={isSaving}>
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
