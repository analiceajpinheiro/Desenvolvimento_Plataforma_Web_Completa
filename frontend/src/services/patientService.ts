import api from './api';
import { Patient, ApiResponse } from '../types';

export const patientService = {
  // Listar todos os pacientes
  async listPatients(page: number = 1, limit: number = 10) {
    const response = await api.get(
      `/patients?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Obter um paciente por ID
  async getPatientById(id: string) {
    const response = await api.get<ApiResponse<Patient>>(`/patients/${id}`);
    return response.data.data;
  },

  // Buscar pacientes por nome ou CPF
  async searchPatients(query: string) {
    const response = await api.get(
      `/patients/search?query=${encodeURIComponent(query)}`
    );
    return response.data.data;
  },

  // Criar novo paciente
  async createPatient(data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await api.post<ApiResponse<Patient>>('/patients', data);
    return response.data.data;
  },

  // Atualizar paciente
  async updatePatient(
    id: string,
    data: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    const response = await api.put<ApiResponse<Patient>>(
      `/patients/${id}`,
      data
    );
    return response.data.data;
  },

  // Deletar paciente (soft delete)
  async deletePatient(id: string) {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/patients/${id}`
    );
    return response.data;
  },

  // Obter geolocalização do paciente
  async getNearbyClinic(patientId: string) {
    const response = await api.get(
      `/patients/${patientId}/nearby-clinics`
    );
    return response.data.data;
  },
};
