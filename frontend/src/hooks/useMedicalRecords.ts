import { useState, useCallback } from 'react';
import {
  medicalRecordService,
  MedicalRecord,
  CreateMedicalRecordDTO,
  UpdateMedicalRecordDTO,
} from '../services/medicalRecordService';

export const useMedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(
    async (filters?: { patientId?: string; doctorId?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await medicalRecordService.getAll(filters);
        setRecords(response.data || []);
      } catch (err) {
        setRecords([]);
        setError('Erro ao carregar prontuários');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const addRecord = useCallback(async (data: CreateMedicalRecordDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newRecord = await medicalRecordService.create(data);
      setRecords((prev) => [newRecord, ...prev]);
      return newRecord;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecord = useCallback(
    async (id: string, data: UpdateMedicalRecordDTO) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await medicalRecordService.update(id, data);
        setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
        return updated;
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeRecord = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await medicalRecordService.delete(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    records,
    loading,
    error,
    fetchRecords,
    addRecord,
    updateRecord,
    removeRecord,
  };
};
