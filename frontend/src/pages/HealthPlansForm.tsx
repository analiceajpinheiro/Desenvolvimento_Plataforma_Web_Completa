import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Input, Navbar } from '../components';
import { useHealthPlans } from '../hooks/useHealthPlans';

interface HealthPlanFormData {
  planName: string;
  provider: string;
  planNumber: string;
  validUntil: string;
  notes: string;
  patientId: string;
}

const initialForm: HealthPlanFormData = {
  planName: '',
  provider: '',
  planNumber: '',
  validUntil: '',
  notes: '',
  patientId: '',
};

export const HealthPlansForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { healthPlans, loading, error, addHealthPlan, updateHealthPlan, fetchHealthPlans } = useHealthPlans();

  const [formData, setFormData] = useState<HealthPlanFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) fetchHealthPlans(1);
  }, [id]);

  useEffect(() => {
    if (id && healthPlans.length > 0) {
      const plan = healthPlans.find((p) => p.id === id);
      if (plan) {
        setFormData({
          planName: plan.planName,
          provider: plan.provider,
          planNumber: plan.planNumber,
          validUntil: plan.validUntil.split('T')[0],
          notes: plan.notes ?? '',
          patientId: plan.patientId,
        });
      }
    }
  }, [id, healthPlans]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.planName.trim()) newErrors.planName = 'Nome do plano é obrigatório';
    if (!formData.provider.trim()) newErrors.provider = 'Operadora é obrigatória';
    if (!formData.planNumber.trim()) newErrors.planNumber = 'Número do plano é obrigatório';
    if (!formData.validUntil) newErrors.validUntil = 'Data de validade é obrigatória';
    if (!formData.patientId.trim()) newErrors.patientId = 'ID do paciente é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        notes: formData.notes || undefined,
      };

      if (id) {
        await updateHealthPlan(id, payload);
        setFormSuccess('Convênio atualizado com sucesso!');
      } else {
        await addHealthPlan(payload as any);
        setFormSuccess('Convênio criado com sucesso!');
        setFormData(initialForm);
      }
      setTimeout(() => navigate('/health-plans'), 1500);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar convênio');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {id ? 'Editar Convênio' : 'Novo Convênio'}
        </h1>

        <div className="mb-6 space-y-3">
          {formError && <Alert type="error" message={formError} />}
          {formSuccess && <Alert type="success" message={formSuccess} />}
          {error && <Alert type="error" message={error} />}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Nome do Plano"
                name="planName"
                value={formData.planName}
                onChange={handleChange}
                error={errors.planName}
                placeholder="Ex: Plano Ouro"
                required
              />
            </div>

            <Input
              label="Operadora"
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              error={errors.provider}
              placeholder="Ex: Unimed"
              required
            />

            <Input
              label="Número do Plano"
              name="planNumber"
              value={formData.planNumber}
              onChange={handleChange}
              error={errors.planNumber}
              placeholder="Ex: 1234567890"
              required
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
              label="Válido até"
              name="validUntil"
              type="date"
              value={formData.validUntil}
              onChange={handleChange}
              error={errors.validUntil}
              required
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações sobre o convênio (opcional)"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button type="submit" variant="primary" size="lg" disabled={isSaving} loading={isSaving}>
              {id ? 'Atualizar' : 'Criar'} Convênio
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => navigate('/health-plans')} disabled={isSaving}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
