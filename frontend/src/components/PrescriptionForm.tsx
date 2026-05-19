import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Prescription } from '../services/prescriptionService';

export type PrescriptionFormValues = {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
};

interface PrescriptionFormProps {
  prescription?: Prescription | null;
  onSave: (data: PrescriptionFormValues) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

const TEXTAREA_CLASS =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none';

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  prescription,
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (prescription) {
      setFormData({
        medication: prescription.medication,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        duration: prescription.duration,
        notes: prescription.notes || '',
      });
    } else {
      setFormData({ medication: '', dosage: '', frequency: '', duration: '', notes: '' });
    }
    setErrors({});
  }, [prescription]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.medication.trim()) newErrors.medication = 'Medicamento é obrigatório';
    if (!formData.dosage.trim()) newErrors.dosage = 'Dosagem é obrigatória';
    if (!formData.frequency.trim()) newErrors.frequency = 'Frequência é obrigatória';
    if (!formData.duration.trim()) newErrors.duration = 'Duração é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave({
      medication: formData.medication.trim(),
      dosage: formData.dosage.trim(),
      frequency: formData.frequency.trim(),
      duration: formData.duration.trim(),
      notes: formData.notes.trim() || undefined,
    });
  };

  return (
    <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-blue-800 mb-4 uppercase tracking-wide">
        {prescription ? 'Editar Prescrição' : 'Nova Prescrição'}
      </h4>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-4">
          <Input
            label="Medicamento"
            name="medication"
            value={formData.medication}
            onChange={handleChange}
            placeholder="Ex: Amoxicilina"
            error={errors.medication}
            required
          />
          <Input
            label="Dosagem"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="Ex: 500mg"
            error={errors.dosage}
            required
          />
          <Input
            label="Frequência"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            placeholder="Ex: 2x ao dia"
            error={errors.frequency}
            required
          />
          <Input
            label="Duração"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Ex: 7 dias"
            error={errors.duration}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Observações{' '}
            <span className="text-gray-400 text-sm font-normal">(Opcional)</span>
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Instruções adicionais..."
            rows={2}
            className={TEXTAREA_CLASS}
          />
        </div>
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSaving}
            loading={isSaving}
          >
            {prescription ? 'Atualizar' : 'Salvar'} Prescrição
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
