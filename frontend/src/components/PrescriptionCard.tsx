import React from 'react';
import { Button } from './Button';
import { Prescription } from '../services/prescriptionService';

interface PrescriptionCardProps {
  prescription: Prescription;
  onEdit: (prescription: Prescription) => void;
  onDelete: (prescription: Prescription) => void;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-base mb-2">
            {prescription.medication}
          </p>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-0.5">
                Dosagem
              </p>
              <p className="text-gray-700">{prescription.dosage}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-0.5">
                Frequência
              </p>
              <p className="text-gray-700">{prescription.frequency}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-0.5">
                Duração
              </p>
              <p className="text-gray-700">{prescription.duration}</p>
            </div>
          </div>
          {prescription.notes && (
            <p className="mt-2 text-sm text-gray-500 italic">
              {prescription.notes}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(prescription)}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(prescription)}
          >
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
};
