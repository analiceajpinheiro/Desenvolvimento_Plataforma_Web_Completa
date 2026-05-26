import { examService, specialtyService, healthPlanService, viaCepService } from '../../src/services';
import { ValidationError, NotFoundError } from '../../src/utils/errors';

// Mock repositórios
jest.mock('../../src/repositories', () => ({
  userRepository: {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
  },
  patientRepository: {
    findById: jest.fn(),
    findAll: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByCPF: jest.fn(),
  },
  appointmentRepository: {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findConflicts: jest.fn(),
    findByPatientId: jest.fn(),
    findByDoctorId: jest.fn(),
  },
  medicalRecordRepository: {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByAppointmentId: jest.fn(),
  },
  prescriptionRepository: {
    findById: jest.fn(),
    findAll: jest.fn(),
    findByMedicalRecord: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  examRepository: {
    findById: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  specialtyRepository: {
    findById: jest.fn(),
    findAll: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  healthPlanRepository: {
    findById: jest.fn(),
    findAll: jest.fn(),
    findByPlanNumber: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock axios para ViaCEP
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  get: jest.fn(),
}));

describe('Exam Service', () => {
  const { examRepository, patientRepository, userRepository } = require('../../src/repositories');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve retornar lista paginada de exames', async () => {
      examRepository.findAll.mockResolvedValue({
        data: [{ id: 'exam-1', name: 'Hemograma', status: 'REQUESTED' }],
        total: 1,
      });

      const result = await examService.getAll(10, 0);
      expect(result.data).toHaveLength(1);
      expect(examRepository.findAll).toHaveBeenCalledWith(10, 0, {});
    });
  });

  describe('getById', () => {
    it('deve retornar exame por ID', async () => {
      const mockExam = { id: 'exam-1', name: 'Hemograma', status: 'REQUESTED' };
      examRepository.findById.mockResolvedValue(mockExam);

      const result = await examService.getById('exam-1');
      expect(result).toEqual(mockExam);
      expect(examRepository.findById).toHaveBeenCalledWith('exam-1');
    });
  });

  describe('create', () => {
    it('deve criar exame com dados válidos', async () => {
      const examData = {
        name: 'Hemograma',
        type: 'LAB',
        patientId: 'patient-1',
        doctorId: 'doctor-1',
      };
      const mockExam = { id: 'exam-1', ...examData, status: 'REQUESTED' };

      patientRepository.findById.mockResolvedValue({ id: 'patient-1' });
      userRepository.findById.mockResolvedValue({ id: 'doctor-1', role: 'DOCTOR' });
      examRepository.create.mockResolvedValue(mockExam);

      const result = await examService.create(examData);
      expect(result).toEqual(mockExam);
      expect(examRepository.create).toHaveBeenCalled();
    });

    it('deve rejeitar criação sem nome do exame', async () => {
      await expect(
        examService.create({ type: 'LAB', patientId: 'p1', doctorId: 'd1' })
      ).rejects.toThrow(ValidationError);
    });

    it('deve rejeitar criação sem paciente', async () => {
      await expect(
        examService.create({ name: 'Hemograma', type: 'LAB', doctorId: 'd1' })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('update', () => {
    it('deve atualizar exame existente', async () => {
      const updatedExam = { id: 'exam-1', name: 'Hemograma', status: 'COMPLETED' };
      examRepository.update.mockResolvedValue(updatedExam);

      const result = await examService.update('exam-1', { status: 'COMPLETED' });
      expect(result.status).toBe('COMPLETED');
    });
  });

  describe('delete', () => {
    it('deve deletar exame', async () => {
      examRepository.delete.mockResolvedValue(undefined);

      await examService.delete('exam-1');
      expect(examRepository.delete).toHaveBeenCalledWith('exam-1');
    });
  });
});

describe('Specialty Service', () => {
  const { specialtyRepository } = require('../../src/repositories');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve retornar lista de especialidades', async () => {
      specialtyRepository.findAll.mockResolvedValue({
        data: [{ id: 'spec-1', name: 'Cardiologia', isActive: true }],
        total: 1,
      });

      const result = await specialtyService.getAll();
      expect(result.data).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('deve criar especialidade com nome válido', async () => {
      const mockSpecialty = { id: 'spec-1', name: 'Neurologia', isActive: true };
      specialtyRepository.findByName.mockResolvedValue(null);
      specialtyRepository.create.mockResolvedValue(mockSpecialty);

      const result = await specialtyService.create({ name: 'Neurologia' });
      expect(result.name).toBe('Neurologia');
    });

    it('deve rejeitar criação sem nome', async () => {
      await expect(specialtyService.create({ name: '' })).rejects.toThrow(ValidationError);
    });
  });

  describe('update', () => {
    it('deve atualizar especialidade existente', async () => {
      const updated = { id: 'spec-1', name: 'Cardiologia Clínica', isActive: true };
      specialtyRepository.findById.mockResolvedValue({ id: 'spec-1', name: 'Cardiologia' });
      specialtyRepository.update.mockResolvedValue(updated);

      const result = await specialtyService.update('spec-1', { name: 'Cardiologia Clínica' });
      expect(result.name).toBe('Cardiologia Clínica');
    });
  });

  describe('delete', () => {
    it('deve desativar especialidade', async () => {
      const deactivated = { id: 'spec-1', name: 'Cardiologia', isActive: false };
      specialtyRepository.delete.mockResolvedValue(deactivated);

      const result = await specialtyService.delete('spec-1');
      expect(specialtyRepository.delete).toHaveBeenCalledWith('spec-1');
    });
  });
});

describe('Health Plan Service', () => {
  const { healthPlanRepository, patientRepository } = require('../../src/repositories');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve retornar lista de convênios', async () => {
      healthPlanRepository.findAll.mockResolvedValue({
        data: [{ id: 'plan-1', planName: 'Plano Ouro', provider: 'Unimed' }],
        total: 1,
      });

      const result = await healthPlanService.getAll();
      expect(result.data).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('deve criar convênio com dados válidos', async () => {
      const planData = {
        planName: 'Plano Ouro',
        provider: 'Unimed',
        planNumber: '123456',
        validUntil: '2026-12-31',
        patientId: 'patient-1',
      };
      const mockPlan = { id: 'plan-1', ...planData };

      patientRepository.findById.mockResolvedValue({ id: 'patient-1' });
      healthPlanRepository.findByPlanNumber.mockResolvedValue(null);
      healthPlanRepository.create.mockResolvedValue(mockPlan);

      const result = await healthPlanService.create(planData);
      expect(result.planName).toBe('Plano Ouro');
    });

    it('deve rejeitar criação sem nome do plano', async () => {
      await expect(
        healthPlanService.create({
          provider: 'Unimed',
          planNumber: '123',
          validUntil: '2026-12-31',
          patientId: 'p1',
        })
      ).rejects.toThrow(ValidationError);
    });

    it('deve rejeitar criação sem operadora', async () => {
      await expect(
        healthPlanService.create({
          planName: 'Plano',
          planNumber: '123',
          validUntil: '2026-12-31',
          patientId: 'p1',
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('update', () => {
    it('deve atualizar convênio existente', async () => {
      const updated = { id: 'plan-1', planName: 'Plano Diamante', isActive: true };
      healthPlanRepository.findById.mockResolvedValue({ id: 'plan-1' });
      healthPlanRepository.update.mockResolvedValue(updated);

      const result = await healthPlanService.update('plan-1', { planName: 'Plano Diamante' });
      expect(result.planName).toBe('Plano Diamante');
    });
  });

  describe('delete', () => {
    it('deve deletar convênio', async () => {
      healthPlanRepository.delete.mockResolvedValue(undefined);

      await healthPlanService.delete('plan-1');
      expect(healthPlanRepository.delete).toHaveBeenCalledWith('plan-1');
    });
  });
});

describe('ViaCEP Service', () => {
  let axiosMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock = require('axios').default;
  });

  it('deve rejeitar CEP com menos de 8 dígitos', async () => {
    await expect(viaCepService.lookupCEP('0131010')).rejects.toThrow(ValidationError);
  });

  it('deve rejeitar CEP com caracteres não numéricos que resultem em menos de 8 dígitos', async () => {
    await expect(viaCepService.lookupCEP('abc')).rejects.toThrow(ValidationError);
  });

  it('deve consultar CEP válido e retornar endereço', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        complemento: '',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP',
      },
    });

    const result = await viaCepService.lookupCEP('01310100');
    expect(result.logradouro).toBe('Avenida Paulista');
    expect(result.localidade).toBe('São Paulo');
    expect(result.uf).toBe('SP');
    expect(result.address).toContain('Avenida Paulista');
  });

  it('deve lançar NotFoundError quando CEP não é encontrado', async () => {
    axiosMock.get.mockResolvedValue({ data: { erro: true } });
    await expect(viaCepService.lookupCEP('99999999')).rejects.toThrow(NotFoundError);
  });

  it('deve lançar ValidationError quando a chamada à API falha', async () => {
    axiosMock.get.mockRejectedValue(new Error('Network error'));
    await expect(viaCepService.lookupCEP('01310100')).rejects.toThrow(ValidationError);
  });
});
