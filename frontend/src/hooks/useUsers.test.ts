import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUsers } from './useUsers';
import { userService } from '../services/userService';

vi.mock('../services/userService', () => ({
  userService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getById: vi.fn(),
  },
}));

const mockUser = {
  id: 'user-1',
  name: 'Admin User',
  email: 'admin@vitacase.com',
  role: 'ADMIN' as any,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockPaginatedResponse = {
  success: true,
  data: [mockUser],
  pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
};

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchUsers', () => {
    it('deve buscar usuários com sucesso', async () => {
      vi.mocked(userService.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.fetchUsers();
      });

      expect(result.current.users).toEqual([mockUser]);
      expect(result.current.total).toBe(1);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('deve definir erro ao falhar', async () => {
      vi.mocked(userService.getAll).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.fetchUsers();
      });

      expect(result.current.error).toBe('Erro ao carregar usuários');
      expect(result.current.users).toEqual([]);
    });

    it('deve aceitar filtro de role', async () => {
      vi.mocked(userService.getAll).mockResolvedValue(mockPaginatedResponse);

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.fetchUsers(1, 'DOCTOR');
      });

      expect(userService.getAll).toHaveBeenCalledWith(1, 'DOCTOR');
    });
  });

  describe('createUser', () => {
    it('deve criar usuário com sucesso', async () => {
      vi.mocked(userService.create).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useUsers());

      let returned: any;
      await act(async () => {
        returned = await result.current.createUser({
          name: 'Admin User',
          email: 'admin@vitacase.com',
          password: 'Admin@1234',
          role: 'ADMIN',
        });
      });

      expect(returned).toEqual(mockUser);
      expect(result.current.users).toContainEqual(mockUser);
      expect(result.current.error).toBeNull();
    });

    it('deve definir erro ao falhar ao criar usuário', async () => {
      vi.mocked(userService.create).mockRejectedValue({
        response: { data: { message: 'Email já em uso' } },
      });

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        try {
          await result.current.createUser({
            name: 'Admin User',
            email: 'admin@vitacase.com',
            password: 'Admin@1234',
            role: 'ADMIN',
          });
        } catch {}
      });

      expect(result.current.error).toBe('Email já em uso');
    });
  });

  describe('updateUser', () => {
    it('deve atualizar usuário com sucesso', async () => {
      const updated = { ...mockUser, name: 'Admin Atualizado' };
      vi.mocked(userService.getAll).mockResolvedValue(mockPaginatedResponse);
      vi.mocked(userService.update).mockResolvedValue(updated);

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.fetchUsers();
      });

      await act(async () => {
        await result.current.updateUser('user-1', { name: 'Admin Atualizado' });
      });

      expect(result.current.users[0].name).toBe('Admin Atualizado');
    });

    it('deve definir erro ao falhar ao atualizar usuário', async () => {
      vi.mocked(userService.update).mockRejectedValue({
        response: { data: { message: 'Usuário não encontrado' } },
      });

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        try {
          await result.current.updateUser('user-999', { name: 'X' });
        } catch {}
      });

      expect(result.current.error).toBe('Usuário não encontrado');
    });
  });

  describe('deleteUser', () => {
    it('deve deletar usuário com sucesso', async () => {
      vi.mocked(userService.getAll).mockResolvedValue(mockPaginatedResponse);
      vi.mocked(userService.delete).mockResolvedValue({ success: true, message: 'Deleted' });

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.fetchUsers();
      });

      await act(async () => {
        await result.current.deleteUser('user-1');
      });

      expect(result.current.users).toHaveLength(0);
    });

    it('deve definir erro ao falhar ao deletar usuário', async () => {
      vi.mocked(userService.delete).mockRejectedValue({
        response: { data: { message: 'Permissão negada' } },
      });

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        try {
          await result.current.deleteUser('user-1');
        } catch {}
      });

      expect(result.current.error).toBe('Permissão negada');
    });

    it('deve usar mensagem padrão ao deletar sem resposta de erro', async () => {
      vi.mocked(userService.delete).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        try {
          await result.current.deleteUser('user-1');
        } catch {}
      });

      expect(result.current.error).toBe('Erro ao remover usuário');
    });
  });

  describe('branches adicionais', () => {
    it('fetchUsers sem pagination retorna total 0', async () => {
      vi.mocked(userService.getAll).mockResolvedValue({ success: true, data: [] } as any);

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.fetchUsers();
      });

      expect(result.current.total).toBe(0);
    });

    it('createUser usa mensagem padrão sem response de erro', async () => {
      vi.mocked(userService.create).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        try {
          await result.current.createUser({ name: 'X', email: 'x@x.com', password: 'X@1234', role: 'ADMIN' });
        } catch {}
      });

      expect(result.current.error).toBe('Erro ao criar usuário');
    });

    it('updateUser usa mensagem padrão sem response de erro', async () => {
      vi.mocked(userService.update).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        try {
          await result.current.updateUser('user-1', { name: 'X' });
        } catch {}
      });

      expect(result.current.error).toBe('Erro ao atualizar usuário');
    });
  });
});
