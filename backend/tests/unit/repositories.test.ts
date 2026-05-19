// Testes para a camada de repositórios
import { PrismaClient } from '@prisma/client';

// Mock do Prisma
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  patient: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  appointment: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

import { userRepository, patientRepository, appointmentRepository } from '../../src/repositories';
import { NotFoundError, ConflictError } from '../../src/utils/errors';

describe('Repositories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Repository', () => {
    describe('findById', () => {
      it('deve retornar um usuário existente', async () => {
        const mockUser = {
          id: 'user-1',
          email: 'dr.joao@example.com',
          name: 'Dr. João',
          role: 'DOCTOR',
          specialty: 'Cardiologia',
          isActive: true,
        };

        mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

        const result = await userRepository.findById('user-1');

        expect(result).toEqual(mockUser);
        expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
          where: { id: 'user-1' },
        });
      });

      it('deve lançar erro se usuário não existir', async () => {
        mockPrismaClient.user.findUnique.mockResolvedValue(null);

        await expect(userRepository.findById('inexistent')).rejects.toThrow(
          NotFoundError
        );
      });
    });

    describe('findByEmail', () => {
      it('deve retornar um usuário por email', async () => {
        const mockUser = {
          id: 'user-1',
          email: 'dr.joao@example.com',
          name: 'Dr. João',
        };

        mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

        const result = await userRepository.findByEmail('dr.joao@example.com');

        expect(result).toEqual(mockUser);
      });
    });

    describe('findAll', () => {
      it('deve retornar lista paginada de usuários', async () => {
        const mockUsers = [
          { id: 'user-1', email: 'dr.joao@example.com', name: 'Dr. João' },
          { id: 'user-2', email: 'recep@example.com', name: 'Recepcionista' },
        ];

        mockPrismaClient.user.findMany.mockResolvedValue(mockUsers);
        mockPrismaClient.user.count.mockResolvedValue(2);

        const result = await userRepository.findAll(10, 0);

        expect(result.data).toEqual(mockUsers);
        expect(result.total).toBe(2);
      });

      it('deve filtrar por role', async () => {
        const mockDoctors = [
          { id: 'user-1', email: 'dr.joao@example.com', name: 'Dr. João', role: 'DOCTOR' },
        ];

        mockPrismaClient.user.findMany.mockResolvedValue(mockDoctors);
        mockPrismaClient.user.count.mockResolvedValue(1);

        const result = await userRepository.findAll(10, 0, 'DOCTOR');

        expect(result.data).toEqual(mockDoctors);
        expect(mockPrismaClient.user.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { role: 'DOCTOR' },
          })
        );
      });
    });

    describe('create', () => {
      it('deve criar novo usuário', async () => {
        const userData = {
          name: 'Dr. João',
          email: 'dr.joao@example.com',
          password: 'hashed-password',
          role: 'DOCTOR',
          specialty: 'Cardiologia',
        };

        const mockUser = {
          id: 'user-1',
          ...userData,
          isActive: true,
          createdAt: new Date(),
        };

        mockPrismaClient.user.findUnique.mockResolvedValue(null);
        mockPrismaClient.user.create.mockResolvedValue(mockUser);

        const result = await userRepository.create(userData);

        expect(result).toEqual(mockUser);
        expect(mockPrismaClient.user.create).toHaveBeenCalled();
      });

      it('deve rejeitar email duplicado', async () => {
        mockPrismaClient.user.findUnique.mockResolvedValue({
          id: 'existing-user',
          email: 'dr.joao@example.com',
        });

        await expect(
          userRepository.create({
            name: 'Dr. João',
            email: 'dr.joao@example.com',
            password: 'password',
            role: 'DOCTOR',
          })
        ).rejects.toThrow(ConflictError);
      });
    });
  });

  describe('Patient Repository', () => {
    describe('findById', () => {
      it('deve retornar um paciente existente', async () => {
        const mockPatient = {
          id: 'patient-1',
          name: 'João Silva',
          cpf: '11144477735',
          email: 'joao@example.com',
        };

        mockPrismaClient.patient.findUnique.mockResolvedValue(mockPatient);

        const result = await patientRepository.findById('patient-1');

        expect(result).toEqual(mockPatient);
      });

      it('deve lançar erro se paciente não existir', async () => {
        mockPrismaClient.patient.findUnique.mockResolvedValue(null);

        await expect(patientRepository.findById('inexistent')).rejects.toThrow(
          NotFoundError
        );
      });
    });

    describe('search', () => {
      it('deve buscar pacientes por nome', async () => {
        const mockPatients = [
          {
            id: 'patient-1',
            name: 'João Silva',
            cpf: '11144477735',
          },
        ];

        mockPrismaClient.patient.findMany.mockResolvedValue(mockPatients);

        const result = await patientRepository.search('João', 10);

        expect(result).toEqual(mockPatients);
        expect(mockPrismaClient.patient.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              OR: expect.arrayContaining([
                expect.objectContaining({ name: expect.anything() }),
              ]),
            }),
          })
        );
      });
    });

    describe('create', () => {
      it('deve criar novo paciente', async () => {
        const patientData = {
          name: 'João Silva',
          cpf: '11144477735',
          birthDate: new Date('1990-05-15'),
          gender: 'M',
          phone: '11987654321',
          email: 'joao@example.com',
          address: 'Rua A, 123',
        };

        const mockPatient = {
          id: 'patient-1',
          ...patientData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrismaClient.patient.findUnique.mockResolvedValue(null);
        mockPrismaClient.patient.create.mockResolvedValue(mockPatient);

        const result = await patientRepository.create(patientData);

        expect(result).toEqual(mockPatient);
      });

      it('deve rejeitar CPF duplicado', async () => {
        mockPrismaClient.patient.findUnique.mockResolvedValue({
          id: 'existing-patient',
          cpf: '11144477735',
        });

        await expect(
          patientRepository.create({
            name: 'João Silva',
            cpf: '11144477735',
            birthDate: new Date(),
            gender: 'M',
            phone: '11987654321',
            email: 'joao@example.com',
            address: 'Rua A, 123',
          })
        ).rejects.toThrow(ConflictError);
      });
    });
  });

  describe('Appointment Repository', () => {
    describe('findById', () => {
      it('deve retornar um agendamento existente', async () => {
        const mockAppointment = {
          id: 'apt-1',
          date: new Date(),
          status: 'CONFIRMED',
          doctorId: 'doctor-1',
          patientId: 'patient-1',
          doctor: { id: 'doctor-1', name: 'Dr. João' },
          patient: { id: 'patient-1', name: 'João Silva' },
        };

        mockPrismaClient.appointment.findUnique.mockResolvedValue(mockAppointment);

        const result = await appointmentRepository.findById('apt-1');

        expect(result).toEqual(mockAppointment);
        expect(mockPrismaClient.appointment.findUnique).toHaveBeenCalledWith({
          where: { id: 'apt-1' },
          include: { doctor: true, patient: true },
        });
      });
    });

    describe('findConflicts', () => {
      it('deve retornar conflitos de agendamento', async () => {
        const mockConflicts = [
          {
            id: 'apt-1',
            date: new Date('2024-12-25T14:00:00Z'),
            status: 'CONFIRMED',
            doctorId: 'doctor-1',
            patientId: 'patient-1',
          },
        ];

        mockPrismaClient.appointment.findMany.mockResolvedValue(mockConflicts);

        const result = await appointmentRepository.findConflicts(
          'doctor-1',
          new Date('2024-12-25')
        );

        expect(result).toEqual(mockConflicts);
      });

      it('deve excluir agendamento específico da busca de conflitos', async () => {
        mockPrismaClient.appointment.findMany.mockResolvedValue([]);

        await appointmentRepository.findConflicts(
          'doctor-1',
          new Date('2024-12-25'),
          'apt-1'
        );

        expect(mockPrismaClient.appointment.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              id: expect.objectContaining({
                not: 'apt-1',
              }),
            }),
          })
        );
      });
    });
  });
});
