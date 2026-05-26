import { useState, useCallback } from 'react';
import { Exam } from '../types';
import { examService } from '../services/examService';

export const useExams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchExams = useCallback(async (pageNum = 1, filters?: { patientId?: string; doctorId?: string; status?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await examService.listExams(pageNum, limit, filters);
      setExams(response.data);
      setPage(pageNum);
      setTotal(response.pagination?.total ?? 0);
    } catch (err) {
      setError('Erro ao carregar exames');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const addExam = useCallback(async (data: Omit<Exam, 'id' | 'createdAt' | 'updatedAt' | 'patient' | 'doctor'>) => {
    setLoading(true);
    setError(null);
    try {
      const newExam = await examService.createExam(data);
      setExams((prev) => [newExam, ...prev]);
      return newExam;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao criar exame';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExam = useCallback(async (id: string, data: Partial<Exam>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await examService.updateExam(id, data);
      setExams((prev) => prev.map((e) => (e.id === id ? updated : e)));
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao atualizar exame';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExam = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await examService.deleteExam(id);
      setExams((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao remover exame';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { exams, loading, error, page, limit, total, fetchExams, addExam, updateExam, deleteExam };
};
