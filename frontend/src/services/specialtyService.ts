import api from './api';
import { Specialty } from '../types';

export const specialtyService = {
  async listSpecialties(page = 1, limit = 50) {
    const response = await api.get(`/specialties?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getSpecialtyById(id: string) {
    const response = await api.get<{ success: boolean; data: Specialty }>(`/specialties/${id}`);
    return response.data.data;
  },

  async createSpecialty(data: { name: string; description?: string }) {
    const response = await api.post<{ success: boolean; data: Specialty }>('/specialties', data);
    return response.data.data;
  },

  async updateSpecialty(id: string, data: { name?: string; description?: string; isActive?: boolean }) {
    const response = await api.put<{ success: boolean; data: Specialty }>(`/specialties/${id}`, data);
    return response.data.data;
  },

  async deleteSpecialty(id: string) {
    const response = await api.delete(`/specialties/${id}`);
    return response.data;
  },
};
