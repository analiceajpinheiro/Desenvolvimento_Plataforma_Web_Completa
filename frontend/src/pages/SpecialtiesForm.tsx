import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Input, Navbar } from '../components';
import { useSpecialties } from '../hooks/useSpecialties';

interface SpecialtyFormData {
  name: string;
  description: string;
  isActive: boolean;
}

export const SpecialtiesForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { specialties, loading, error, addSpecialty, updateSpecialty, fetchSpecialties } = useSpecialties();

  const [formData, setFormData] = useState<SpecialtyFormData>({ name: '', description: '', isActive: true });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) fetchSpecialties();
  }, [id]);

  useEffect(() => {
    if (id && specialties.length > 0) {
      const specialty = specialties.find((s) => s.id === id);
      if (specialty) {
        setFormData({
          name: specialty.name,
          description: specialty.description ?? '',
          isActive: specialty.isActive,
        });
      }
    }
  }, [id, specialties]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome da especialidade é obrigatório';
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
      if (id) {
        await updateSpecialty(id, formData);
        setFormSuccess('Especialidade atualizada com sucesso!');
      } else {
        await addSpecialty({ name: formData.name, description: formData.description || undefined });
        setFormSuccess('Especialidade criada com sucesso!');
        setFormData({ name: '', description: '', isActive: true });
      }
      setTimeout(() => navigate('/specialties'), 1500);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar especialidade');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {id ? 'Editar Especialidade' : 'Nova Especialidade'}
        </h1>

        <div className="mb-6 space-y-3">
          {formError && <Alert type="error" message={formError} />}
          {formSuccess && <Alert type="success" message={formSuccess} />}
          {error && <Alert type="error" message={error} />}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <Input
            label="Nome da Especialidade"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Ex: Cardiologia"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição da especialidade (opcional)"
            />
          </div>

          {id && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Especialidade ativa
              </label>
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <Button type="submit" variant="primary" size="lg" disabled={isSaving} loading={isSaving}>
              {id ? 'Atualizar' : 'Criar'} Especialidade
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => navigate('/specialties')} disabled={isSaving}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
