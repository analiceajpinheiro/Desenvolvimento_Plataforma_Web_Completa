import { useState, useCallback } from 'react';
import { User } from '../types';
import { userService, CreateUserDTO, UpdateUserDTO } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async (pageNum = 1, role?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAll(pageNum, role);
      setUsers(response.data);
      setPage(pageNum);
      setTotal(response.pagination?.total ?? 0);
    } catch (err) {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const createUser = useCallback(async (data: CreateUserDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await userService.create(data);
      setUsers((prev) => [newUser, ...prev]);
      return newUser;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao criar usuário';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: UpdateUserDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await userService.update(id, data);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao atualizar usuário';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await userService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao remover usuário';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, loading, error, page, limit, total, fetchUsers, createUser, updateUser, deleteUser };
};
