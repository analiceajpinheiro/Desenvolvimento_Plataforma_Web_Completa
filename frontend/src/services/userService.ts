import api from './api';
import { User } from '../types';

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: string;
  specialty?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: string;
  specialty?: string;
  isActive?: boolean;
}

export const userService = {
  async getAll(page = 1, role?: string) {
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (role) params.set('role', role);
    const response = await api.get<{
      success: boolean;
      data: User[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/users?${params.toString()}`);
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<{ success: boolean; data: User }>(
      `/users/${id}`
    );
    return response.data.data;
  },

  async update(id: string, data: UpdateUserDTO) {
    const response = await api.put<{ success: boolean; data: User }>(
      `/users/${id}`,
      data
    );
    return response.data.data;
  },

  async delete(id: string) {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/users/${id}`
    );
    return response.data;
  },

  async create(data: CreateUserDTO) {
    const response = await api.post<{
      success: boolean;
      data: { user: User; token: string };
    }>('/auth/register', data);
    return response.data.data.user;
  },
};
