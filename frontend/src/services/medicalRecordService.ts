import api from './api';
import { ApiResponse } from '../types';

export interface MedicalRecord {
  id: string;
  mainComplaint: string;
  history?: string;
  physicalExam?: string;
  diagnosis?: string;
  treatment?: string;
  doctorId: string;
  patientId: string;
  appointmentId: string;
  doctor?: {
    id: string;
    name: string;
    role: string;
    specialty?: string;
  };
  patient?: {
    id: string;
    name: string;
    cpf: string;
  };
  prescriptions?: {
    id: string;
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalRecordDTO {
  patientId: string;
  doctorId: string;
  appointmentId: string;
  mainComplaint: string;
  history?: string;
  physicalExam?: string;
  diagnosis?: string;
  treatment?: string;
}

export interface UpdateMedicalRecordDTO {
  mainComplaint?: string;
  history?: string;
  physicalExam?: string;
  diagnosis?: string;
  treatment?: string;
}

export const medicalRecordService = {
  async getAll(filters?: { patientId?: string; doctorId?: string }) {
    const params = new URLSearchParams();
    if (filters?.patientId) params.set('patientId', filters.patientId);
    if (filters?.doctorId) params.set('doctorId', filters.doctorId);
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/medical-records${query}`);
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<ApiResponse<MedicalRecord>>(
      `/medical-records/${id}`
    );
    return response.data.data;
  },

  async getByPatient(patientId: string) {
    const response = await api.get(
      `/patients/${patientId}/medical-records`
    );
    return response.data.data as MedicalRecord[];
  },

  async create(data: CreateMedicalRecordDTO) {
    const response = await api.post<ApiResponse<MedicalRecord>>(
      '/medical-records',
      data
    );
    return response.data.data;
  },

  async update(id: string, data: UpdateMedicalRecordDTO) {
    const response = await api.put<ApiResponse<MedicalRecord>>(
      `/medical-records/${id}`,
      data
    );
    return response.data.data;
  },

  async delete(id: string) {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/medical-records/${id}`
    );
    return response.data;
  },
};
