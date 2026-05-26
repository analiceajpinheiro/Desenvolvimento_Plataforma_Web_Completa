import { useState, useCallback } from 'react';
import { Specialty } from '../types';
import { specialtyService } from '../services/specialtyService';

export const useSpecialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [total, setTotal] = useState(0);

  const fetchSpecialties = useCallback(async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await specialtyService.listSpecialties(pageNum, limit);
      setSpecialties(response.data);
      setPage(pageNum);
      setTotal(response.pagination?.total ?? 0);
    } catch (err) {
      setError('Erro ao carregar especialidades');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const addSpecialty = useCallback(async (data: { name: string; description?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const newSpecialty = await specialtyService.createSpecialty(data);
      setSpecialties((prev) => [...prev, newSpecialty].sort((a, b) => a.name.localeCompare(b.name)));
      return newSpecialty;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao criar especialidade';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSpecialty = useCallback(async (id: string, data: Partial<Specialty>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await specialtyService.updateSpecialty(id, data);
      setSpecialties((prev) => prev.map((s) => (s.id === id ? updated : s)));
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao atualizar especialidade';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSpecialty = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await specialtyService.deleteSpecialty(id);
      setSpecialties((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao remover especialidade';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { specialties, loading, error, page, limit, total, fetchSpecialties, addSpecialty, updateSpecialty, deleteSpecialty };
};
