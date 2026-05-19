import api from './api';
import { ApiResponse } from '../types';

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  doctorId: string;
  medicalRecordId: string;
  doctor?: {
    id: string;
    name: string;
    role: string;
    specialty?: string;
  };
  createdAt: string;
}

export interface CreatePrescriptionDTO {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  doctorId: string;
}

export interface UpdatePrescriptionDTO {
  medication?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  notes?: string;
}

export const prescriptionService = {
  async getByMedicalRecord(medicalRecordId: string) {
    const response = await api.get<ApiResponse<Prescription[]>>(
      `/medical-records/${medicalRecordId}/prescriptions`
    );
    return response.data.data;
  },

  async create(medicalRecordId: string, data: CreatePrescriptionDTO) {
    const response = await api.post<ApiResponse<Prescription>>(
      `/medical-records/${medicalRecordId}/prescriptions`,
      data
    );
    return response.data.data;
  },

  async update(id: string, data: UpdatePrescriptionDTO) {
    const response = await api.put<ApiResponse<Prescription>>(
      `/prescriptions/${id}`,
      data
    );
    return response.data.data;
  },

  async delete(id: string) {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/prescriptions/${id}`
    );
    return response.data;
  },
};
