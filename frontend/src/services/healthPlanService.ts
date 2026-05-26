import api from './api';
import { HealthPlan, ViaCepResponse } from '../types';

export const healthPlanService = {
  async listHealthPlans(page = 1, limit = 10, patientId?: string) {
    let url = `/health-plans?page=${page}&limit=${limit}`;
    if (patientId) url += `&patientId=${patientId}`;
    const response = await api.get(url);
    return response.data;
  },

  async getHealthPlanById(id: string) {
    const response = await api.get<{ success: boolean; data: HealthPlan }>(`/health-plans/${id}`);
    return response.data.data;
  },

  async createHealthPlan(data: Omit<HealthPlan, 'id' | 'createdAt' | 'updatedAt' | 'patient' | 'isActive'>) {
    const response = await api.post<{ success: boolean; data: HealthPlan }>('/health-plans', data);
    return response.data.data;
  },

  async updateHealthPlan(id: string, data: Partial<Omit<HealthPlan, 'id' | 'createdAt' | 'updatedAt' | 'patient'>>) {
    const response = await api.put<{ success: boolean; data: HealthPlan }>(`/health-plans/${id}`, data);
    return response.data.data;
  },

  async deleteHealthPlan(id: string) {
    const response = await api.delete(`/health-plans/${id}`);
    return response.data;
  },
};

export const cepService = {
  async lookupCEP(cep: string): Promise<ViaCepResponse> {
    const response = await api.get<{ success: boolean; data: ViaCepResponse }>(
      `/address/cep/${cep.replace(/\D/g, '')}`
    );
    return response.data.data;
  },
};
