import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useHealthPlans } from './useHealthPlans';
import { healthPlanService } from '../services/healthPlanService';

vi.mock('../services/healthPlanService', () => ({
  healthPlanService: {
    listHealthPlans: vi.fn(),
    createHealthPlan: vi.fn(),
    updateHealthPlan: vi.fn(),
    deleteHealthPlan: vi.fn(),
    getHealthPlanById: vi.fn(),
  },
  cepService: {
    lookupCEP: vi.fn(),
  },
}));

const mockHealthPlan = {
  id: 'plan-1',
  planName: 'Plano Ouro',
  provider: 'Unimed',
  planNumber: '123456',
  validUntil: '2026-12-31',
  isActive: true,
  patientId: 'patient-1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockListResponse = {
  data: [mockHealthPlan],
  pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
};

describe('useHealthPlans', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchHealthPlans', () => {
    it('deve buscar convênios com sucesso', async () => {
      vi.mocked(healthPlanService.listHealthPlans).mockResolvedValue(mockListResponse);

      const { result } = renderHook(() => useHealthPlans());

      await act(async () => {
        await result.current.fetchHealthPlans();
      });

      expect(result.current.healthPlans).toEqual([mockHealthPlan]);
      expect(result.current.total).toBe(1);
      expect(result.current.error).toBeNull();
    });

    it('deve definir erro ao falhar', async () => {
      vi.mocked(healthPlanService.listHealthPlans).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useHealthPlans());

      await act(async () => {
        await result.current.fetchHealthPlans();
      });

      expect(result.current.error).toBe('Erro ao carregar convênios');
      expect(result.current.healthPlans).toEqual([]);
    });

    it('deve aceitar filtro de patientId', async () => {
      vi.mocked(healthPlanService.listHealthPlans).mockResolvedValue(mockListResponse);

      const { result } = renderHook(() => useHealthPlans());

      await act(async () => {
        await result.current.fetchHealthPlans(1, 'patient-1');
      });

      expect(healthPlanService.listHealthPlans).toHaveBeenCalledWith(1, 10, 'patient-1');
    });
  });

  describe('addHealthPlan', () => {
    it('deve criar convênio com sucesso', async () => {
      vi.mocked(healthPlanService.createHealthPlan).mockResolvedValue(mockHealthPlan);

      const { result } = renderHook(() => useHealthPlans());

      let returned: any;
      await act(async () => {
        returned = await result.current.addHealthPlan({
          planName: 'Plano Ouro',
          provider: 'Unimed',
          planNumber: '123456',
          validUntil: '2026-12-31',
          patientId: 'patient-1',
        });
      });

      expect(returned).toEqual(mockHealthPlan);
      expect(result.current.healthPlans).toContainEqual(mockHealthPlan);
    });

    it('deve lançar erro ao falhar ao criar convênio', async () => {
      vi.mocked(healthPlanService.createHealthPlan).mockRejectedValue({
        response: { data: { message: 'Paciente não encontrado' } },
      });

      const { result } = renderHook(() => useHealthPlans());

      await act(async () => {
        try {
          await result.current.addHealthPlan({
            planName: 'Plano Ouro',
            provider: 'Unimed',
            planNumber: '123456',
            validUntil: '2026-12-31',
            patientId: 'invalid',
          });
        } catch {}
      });

      expect(result.current.error).toBe('Paciente não encontrado');
    });
  });

  describe('updateHealthPlan', () => {
    it('deve atualizar convênio com sucesso', async () => {
      const updated = { ...mockHealthPlan, planName: 'Plano Diamante' };
      vi.mocked(healthPlanService.listHealthPlans).mockResolvedValue(mockListResponse);
      vi.mocked(healthPlanService.updateHealthPlan).mockResolvedValue(updated);

      const { result } = renderHook(() => useHealthPlans());

      await act(async () => {
        await result.current.fetchHealthPlans();
      });

      await act(async () => {
        await result.current.updateHealthPlan('plan-1', { planName: 'Plano Diamante' });
      });

      expect(result.current.healthPlans[0].planName).toBe('Plano Diamante');
    });

    it('deve lançar erro ao falhar ao atualizar convênio', async () => {
      vi.mocked(healthPlanService.updateHealthPlan).mockRejectedValue({
        response: { data: { message: 'Convênio não encontrado' } },
      });

      const { result } = renderHook(() => useHealthPlans());

      await act(async () => {
        try {
          await result.current.updateHealthPlan('plan-999', { planName: 'X' });
        } catch {}
      });

      expect(result.current.error).toBe('Convênio não encontrado');
    });
  });

  describe('deleteHealthPlan', () => {
    it('deve deletar convênio com sucesso', async () => {
      vi.mocked(healthPlanService.listHealthPlans).mockResolvedValue(mockListResponse);
      vi.mocked(healthPlanService.deleteHealthPlan).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useHealthPlans());

      await act(async () => {
        await result.current.fetchHealthPlans();
      });

      await act(async () => {
        await result.current.deleteHealthPlan('plan-1');
      });

      expect(result.current.healthPlans).toHaveLength(0);
    });

    it('deve lançar erro ao falhar ao deletar convênio', async () => {
      vi.mocked(healthPlanService.deleteHealthPlan).mockRejectedValue({
        response: { data: { message: 'Permissão negada' } },
      });

      const { result } = renderHook(() => useHealthPlans());

      await act(async () => {
        try {
          await result.current.deleteHealthPlan('plan-1');
        } catch {}
      });

      expect(result.current.error).toBe('Permissão negada');
    });

    it('deve usar mensagem padrão ao deletar sem response de erro', async () => {
      vi.mocked(healthPlanService.deleteHealthPlan).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useHealthPlans());

      await act(async () => {
        try {
          await result.current.deleteHealthPlan('plan-1');
        } catch {}
      });

      expect(result.current.error).toBe('Erro ao remover convênio');
    });
  });

  describe('branches adicionais', () => {
    it('fetchHealthPlans sem pagination retorna total 0', async () => {
      vi.mocked(healthPlanService.listHealthPlans).mockResolvedValue({ data: [] } as any);

      const { result } = renderHook(() => useHealthPlans());

      await act(async () => {
        await result.current.fetchHealthPlans();
      });

      expect(result.current.total).toBe(0);
    });

    it('addHealthPlan usa mensagem padrão sem response de erro', async () => {
      vi.mocked(healthPlanService.createHealthPlan).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useHealthPlans());

      await act(async () => {
        try {
          await result.current.addHealthPlan({
            planName: 'X', provider: 'Y', planNumber: '000', validUntil: '2026-01-01', patientId: 'p1',
          });
        } catch {}
      });

      expect(result.current.error).toBe('Erro ao criar convênio');
    });

    it('updateHealthPlan usa mensagem padrão sem response de erro', async () => {
      vi.mocked(healthPlanService.updateHealthPlan).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useHealthPlans());

      await act(async () => {
        try {
          await result.current.updateHealthPlan('plan-1', { planName: 'X' });
        } catch {}
      });

      expect(result.current.error).toBe('Erro ao atualizar convênio');
    });
  });
});
