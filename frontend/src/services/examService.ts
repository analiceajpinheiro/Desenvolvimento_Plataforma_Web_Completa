import api from './api';
import { Exam } from '../types';

export const examService = {
  async listExams(page = 1, limit = 10, filters?: { patientId?: string; doctorId?: string; status?: string }) {
    let url = `/exams?page=${page}&limit=${limit}`;
    if (filters?.patientId) url += `&patientId=${filters.patientId}`;
    if (filters?.doctorId) url += `&doctorId=${filters.doctorId}`;
    if (filters?.status) url += `&status=${filters.status}`;
    const response = await api.get(url);
    return response.data;
  },

  async getExamById(id: string) {
    const response = await api.get<{ success: boolean; data: Exam }>(`/exams/${id}`);
    return response.data.data;
  },

  async createExam(data: Omit<Exam, 'id' | 'createdAt' | 'updatedAt' | 'patient' | 'doctor'>) {
    const response = await api.post<{ success: boolean; data: Exam }>('/exams', data);
    return response.data.data;
  },

  async updateExam(id: string, data: Partial<Omit<Exam, 'id' | 'createdAt' | 'updatedAt' | 'patient' | 'doctor'>>) {
    const response = await api.put<{ success: boolean; data: Exam }>(`/exams/${id}`, data);
    return response.data.data;
  },

  async deleteExam(id: string) {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },
};
