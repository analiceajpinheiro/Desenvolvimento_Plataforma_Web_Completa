import api from './api';
import { Appointment, ApiResponse } from '../types';

export const appointmentService = {
  // Listar todos os agendamentos
  async listAppointments(page: number = 1, limit: number = 10) {
    const response = await api.get(
      `/appointments?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Obter agendamento por ID
  async getAppointmentById(id: string) {
    const response = await api.get<ApiResponse<Appointment>>(
      `/appointments/${id}`
    );
    return response.data.data;
  },

  // Listar agendamentos de um paciente
  async getPatientAppointments(patientId: string) {
    const response = await api.get(
      `/patients/${patientId}/appointments`
    );
    return response.data.data;
  },

  // Listar agendamentos de um médico
  async getDoctorAppointments(doctorId: string, date?: string) {
    let url = `/doctors/${doctorId}/appointments`;
    if (date) {
      url += `?date=${date}`;
    }
    const response = await api.get(url);
    return response.data.data;
  },

  // Criar novo agendamento
  async createAppointment(
    data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) {
    const response = await api.post<ApiResponse<Appointment>>(
      '/appointments',
      data
    );
    return response.data.data;
  },

  // Atualizar agendamento
  async updateAppointment(
    id: string,
    data: Partial<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    const response = await api.put<ApiResponse<Appointment>>(
      `/appointments/${id}`,
      data
    );
    return response.data.data;
  },

  // Cancelar agendamento
  async cancelAppointment(id: string, reason: string) {
    const response = await api.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/cancel`,
      { reason }
    );
    return response.data.data;
  },

  // Verificar disponibilidade do médico
  async checkDoctorAvailability(doctorId: string, date: string) {
    const response = await api.get(
      `/doctors/${doctorId}/availability?date=${date}`
    );
    return response.data.data;
  },

  // Listar slots disponíveis para um médico em uma data
  async getAvailableSlots(doctorId: string, date: string) {
    const response = await api.get(
      `/doctors/${doctorId}/available-slots?date=${date}`
    );
    return response.data.data;
  },
};
