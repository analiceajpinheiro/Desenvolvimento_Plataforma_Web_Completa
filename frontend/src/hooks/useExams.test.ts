import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useExams } from './useExams';
import { examService } from '../services/examService';

vi.mock('../services/examService', () => ({
  examService: {
    listExams: vi.fn(),
    createExam: vi.fn(),
    updateExam: vi.fn(),
    deleteExam: vi.fn(),
    getExamById: vi.fn(),
  },
}));

const mockExam = {
  id: 'exam-1',
  name: 'Hemograma Completo',
  type: 'LAB' as any,
  status: 'REQUESTED' as any,
  patientId: 'patient-1',
  doctorId: 'doctor-1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockListResponse = {
  data: [mockExam],
  pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
};

describe('useExams', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchExams', () => {
    it('deve buscar exames com sucesso', async () => {
      vi.mocked(examService.listExams).mockResolvedValue(mockListResponse);

      const { result } = renderHook(() => useExams());

      await act(async () => {
        await result.current.fetchExams();
      });

      expect(result.current.exams).toEqual([mockExam]);
      expect(result.current.total).toBe(1);
      expect(result.current.error).toBeNull();
    });

    it('deve definir erro ao falhar', async () => {
      vi.mocked(examService.listExams).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useExams());

      await act(async () => {
        await result.current.fetchExams();
      });

      expect(result.current.error).toBe('Erro ao carregar exames');
      expect(result.current.exams).toEqual([]);
    });

    it('deve aceitar filtros opcionais', async () => {
      vi.mocked(examService.listExams).mockResolvedValue(mockListResponse);

      const { result } = renderHook(() => useExams());

      await act(async () => {
        await result.current.fetchExams(1, { patientId: 'patient-1' });
      });

      expect(examService.listExams).toHaveBeenCalledWith(1, 10, { patientId: 'patient-1' });
    });
  });

  describe('addExam', () => {
    it('deve criar exame com sucesso', async () => {
      vi.mocked(examService.createExam).mockResolvedValue(mockExam);

      const { result } = renderHook(() => useExams());

      let returned: any;
      await act(async () => {
        returned = await result.current.addExam({
          name: 'Hemograma Completo',
          type: 'LAB' as any,
          status: 'REQUESTED' as any,
          patientId: 'patient-1',
          doctorId: 'doctor-1',
        });
      });

      expect(returned).toEqual(mockExam);
      expect(result.current.exams).toContainEqual(mockExam);
    });

    it('deve lançar erro ao falhar ao criar exame', async () => {
      vi.mocked(examService.createExam).mockRejectedValue({
        response: { data: { message: 'Paciente não encontrado' } },
      });

      const { result } = renderHook(() => useExams());

      await act(async () => {
        try {
          await result.current.addExam({
            name: 'Hemograma',
            type: 'LAB' as any,
            status: 'REQUESTED' as any,
            patientId: 'invalid',
            doctorId: 'doctor-1',
          });
        } catch {}
      });

      expect(result.current.error).toBe('Paciente não encontrado');
    });
  });

  describe('updateExam', () => {
    it('deve atualizar exame com sucesso', async () => {
      const updated = { ...mockExam, status: 'COMPLETED' as any };
      vi.mocked(examService.listExams).mockResolvedValue(mockListResponse);
      vi.mocked(examService.updateExam).mockResolvedValue(updated);

      const { result } = renderHook(() => useExams());

      await act(async () => {
        await result.current.fetchExams();
      });

      await act(async () => {
        await result.current.updateExam('exam-1', { status: 'COMPLETED' as any });
      });

      expect(result.current.exams[0].status).toBe('COMPLETED');
    });

    it('deve lançar erro ao falhar ao atualizar exame', async () => {
      vi.mocked(examService.updateExam).mockRejectedValue({
        response: { data: { message: 'Exame não encontrado' } },
      });

      const { result } = renderHook(() => useExams());

      await act(async () => {
        try {
          await result.current.updateExam('exam-999', { status: 'COMPLETED' as any });
        } catch {}
      });

      expect(result.current.error).toBe('Exame não encontrado');
    });
  });

  describe('deleteExam', () => {
    it('deve deletar exame com sucesso', async () => {
      vi.mocked(examService.listExams).mockResolvedValue(mockListResponse);
      vi.mocked(examService.deleteExam).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useExams());

      await act(async () => {
        await result.current.fetchExams();
      });

      await act(async () => {
        await result.current.deleteExam('exam-1');
      });

      expect(result.current.exams).toHaveLength(0);
    });

    it('deve lançar erro ao falhar ao deletar exame', async () => {
      vi.mocked(examService.deleteExam).mockRejectedValue({
        response: { data: { message: 'Permissão negada' } },
      });

      const { result } = renderHook(() => useExams());

      await act(async () => {
        try {
          await result.current.deleteExam('exam-1');
        } catch {}
      });

      expect(result.current.error).toBe('Permissão negada');
    });
  });
});
