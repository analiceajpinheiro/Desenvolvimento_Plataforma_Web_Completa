import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSpecialties } from './useSpecialties';
import { specialtyService } from '../services/specialtyService';

vi.mock('../services/specialtyService', () => ({
  specialtyService: {
    listSpecialties: vi.fn(),
    createSpecialty: vi.fn(),
    updateSpecialty: vi.fn(),
    deleteSpecialty: vi.fn(),
    getSpecialtyById: vi.fn(),
  },
}));

const mockSpecialty = {
  id: 'specialty-1',
  name: 'Cardiologia',
  description: 'Especialidade do coração',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockListResponse = {
  data: [mockSpecialty],
  pagination: { total: 1, page: 1, limit: 50, totalPages: 1 },
};

describe('useSpecialties', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchSpecialties', () => {
    it('deve buscar especialidades com sucesso', async () => {
      vi.mocked(specialtyService.listSpecialties).mockResolvedValue(mockListResponse);

      const { result } = renderHook(() => useSpecialties());

      await act(async () => {
        await result.current.fetchSpecialties();
      });

      expect(result.current.specialties).toEqual([mockSpecialty]);
      expect(result.current.total).toBe(1);
      expect(result.current.error).toBeNull();
    });

    it('deve definir erro ao falhar', async () => {
      vi.mocked(specialtyService.listSpecialties).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useSpecialties());

      await act(async () => {
        await result.current.fetchSpecialties();
      });

      expect(result.current.error).toBe('Erro ao carregar especialidades');
      expect(result.current.specialties).toEqual([]);
    });
  });

  describe('addSpecialty', () => {
    it('deve criar especialidade com sucesso', async () => {
      vi.mocked(specialtyService.createSpecialty).mockResolvedValue(mockSpecialty);

      const { result } = renderHook(() => useSpecialties());

      let returned: any;
      await act(async () => {
        returned = await result.current.addSpecialty({
          name: 'Cardiologia',
          description: 'Especialidade do coração',
        });
      });

      expect(returned).toEqual(mockSpecialty);
      expect(result.current.specialties).toContainEqual(mockSpecialty);
    });

    it('deve lançar erro ao falhar ao criar especialidade', async () => {
      vi.mocked(specialtyService.createSpecialty).mockRejectedValue({
        response: { data: { message: 'Especialidade já existe' } },
      });

      const { result } = renderHook(() => useSpecialties());

      await act(async () => {
        try {
          await result.current.addSpecialty({ name: 'Cardiologia' });
        } catch {}
      });

      expect(result.current.error).toBe('Especialidade já existe');
    });
  });

  describe('updateSpecialty', () => {
    it('deve atualizar especialidade com sucesso', async () => {
      const updated = { ...mockSpecialty, name: 'Cardiologia Avançada' };
      vi.mocked(specialtyService.listSpecialties).mockResolvedValue(mockListResponse);
      vi.mocked(specialtyService.updateSpecialty).mockResolvedValue(updated);

      const { result } = renderHook(() => useSpecialties());

      await act(async () => {
        await result.current.fetchSpecialties();
      });

      await act(async () => {
        await result.current.updateSpecialty('specialty-1', { name: 'Cardiologia Avançada' });
      });

      expect(result.current.specialties[0].name).toBe('Cardiologia Avançada');
    });

    it('deve lançar erro ao falhar ao atualizar especialidade', async () => {
      vi.mocked(specialtyService.updateSpecialty).mockRejectedValue({
        response: { data: { message: 'Especialidade não encontrada' } },
      });

      const { result } = renderHook(() => useSpecialties());

      await act(async () => {
        try {
          await result.current.updateSpecialty('specialty-999', { name: 'X' });
        } catch {}
      });

      expect(result.current.error).toBe('Especialidade não encontrada');
    });
  });

  describe('deleteSpecialty', () => {
    it('deve deletar especialidade com sucesso', async () => {
      vi.mocked(specialtyService.listSpecialties).mockResolvedValue(mockListResponse);
      vi.mocked(specialtyService.deleteSpecialty).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useSpecialties());

      await act(async () => {
        await result.current.fetchSpecialties();
      });

      await act(async () => {
        await result.current.deleteSpecialty('specialty-1');
      });

      expect(result.current.specialties).toHaveLength(0);
    });

    it('deve lançar erro ao falhar ao deletar especialidade', async () => {
      vi.mocked(specialtyService.deleteSpecialty).mockRejectedValue({
        response: { data: { message: 'Permissão negada' } },
      });

      const { result } = renderHook(() => useSpecialties());

      await act(async () => {
        try {
          await result.current.deleteSpecialty('specialty-1');
        } catch {}
      });

      expect(result.current.error).toBe('Permissão negada');
    });
  });
});
