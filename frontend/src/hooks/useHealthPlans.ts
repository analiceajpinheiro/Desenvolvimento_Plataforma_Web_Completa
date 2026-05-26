import { useState, useCallback } from 'react';
import { HealthPlan } from '../types';
import { healthPlanService } from '../services/healthPlanService';

export const useHealthPlans = () => {
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchHealthPlans = useCallback(async (pageNum = 1, patientId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await healthPlanService.listHealthPlans(pageNum, limit, patientId);
      setHealthPlans(response.data);
      setPage(pageNum);
      setTotal(response.pagination?.total ?? 0);
    } catch (err) {
      setError('Erro ao carregar convênios');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const addHealthPlan = useCallback(async (data: Omit<HealthPlan, 'id' | 'createdAt' | 'updatedAt' | 'patient' | 'isActive'>) => {
    setLoading(true);
    setError(null);
    try {
      const newPlan = await healthPlanService.createHealthPlan(data);
      setHealthPlans((prev) => [newPlan, ...prev]);
      return newPlan;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao criar convênio';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateHealthPlan = useCallback(async (id: string, data: Partial<HealthPlan>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await healthPlanService.updateHealthPlan(id, data);
      setHealthPlans((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao atualizar convênio';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteHealthPlan = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await healthPlanService.deleteHealthPlan(id);
      setHealthPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao remover convênio';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { healthPlans, loading, error, page, limit, total, fetchHealthPlans, addHealthPlan, updateHealthPlan, deleteHealthPlan };
};
