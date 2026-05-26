/**
 * Testes adicionais de repositório para cobrir métodos não exercidos
 * nos testes existentes (userRepository.update/delete,
 * appointmentRepository, medicalRecordRepository, prescriptionRepository,
 * examRepository, specialtyRepository, healthPlanRepository).
 */

import { PrismaClient } from '@prisma/client';
import { NotFoundError, ConflictError } from '../../src/utils/errors';

// ── Mock Prisma ───────────────────────────────────────────────────────────────

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  patient: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
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
  medicalRecord: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  prescription: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  exam: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  specialty: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  healthPlan: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
  Role: { DOCTOR: 'DOCTOR', RECEPTIONIST: 'RECEPTIONIST', ADMIN: 'ADMIN' },
  ExamType: { LAB: 'LAB', IMAGE: 'IMAGE', FUNCTIONAL: 'FUNCTIONAL', OTHER: 'OTHER' },
  ExamStatus: { REQUESTED: 'REQUESTED', SCHEDULED: 'SCHEDULED', IN_PROGRESS: 'IN_PROGRESS', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED' },
}));

import {
  userRepository,
  patientRepository,
  appointmentRepository,
  medicalRecordRepository,
  prescriptionRepository,
  examRepository,
  specialtyRepository,
  healthPlanRepository,
} from '../../src/repositories';

beforeEach(() => jest.resetAllMocks());

// ── User Repository — update & delete ─────────────────────────────────────────

describe('userRepository — métodos adicionais', () => {
  it('update deve atualizar usuário existente', async () => {
    const mockUser = { id: 'u1', name: 'Dr. João', role: 'DOCTOR', isActive: true };
    const updatedUser = { ...mockUser, name: 'Dr. João Atualizado' };
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.user.update.mockResolvedValue(updatedUser);

    const result = await userRepository.update('u1', { name: 'Dr. João Atualizado' });
    expect(result.name).toBe('Dr. João Atualizado');
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'u1' } })
    );
  });

  it('update deve lançar NotFoundError se usuário não existir', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(userRepository.update('none', { name: 'X' })).rejects.toThrow(NotFoundError);
  });

  it('delete deve desativar usuário (soft delete)', async () => {
    const mockUser = { id: 'u1', isActive: true };
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.user.update.mockResolvedValue({ ...mockUser, isActive: false });

    await userRepository.delete('u1');
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isActive: false } })
    );
  });

  it('delete deve lançar NotFoundError se usuário não existir', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(userRepository.delete('none')).rejects.toThrow(NotFoundError);
  });
});

// ── Patient Repository — métodos adicionais ───────────────────────────────────

describe('patientRepository — métodos adicionais', () => {
  it('findAll deve retornar lista paginada de pacientes', async () => {
    const mockPatients = [{ id: 'p1', name: 'João' }];
    mockPrisma.patient.findMany.mockResolvedValue(mockPatients);
    mockPrisma.patient.count.mockResolvedValue(1);

    const result = await patientRepository.findAll(10, 0);
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('findByCPF deve retornar paciente pelo CPF', async () => {
    const mockPatient = { id: 'p1', cpf: '11144477735' };
    mockPrisma.patient.findUnique.mockResolvedValue(mockPatient);

    const result = await patientRepository.findByCPF('11144477735');
    expect(result).toEqual(mockPatient);
  });

  it('update deve atualizar dados do paciente', async () => {
    const mockPatient = { id: 'p1', name: 'João' };
    const updatedPatient = { ...mockPatient, name: 'João Atualizado' };
    // findById call
    mockPrisma.patient.findUnique.mockResolvedValueOnce(mockPatient);
    // check email uniqueness
    mockPrisma.patient.findFirst.mockResolvedValue(null);
    mockPrisma.patient.update.mockResolvedValue(updatedPatient);

    const result = await patientRepository.update('p1', { name: 'João Atualizado' });
    expect(result.name).toBe('João Atualizado');
  });

  it('update deve lançar ConflictError se novo email já existe', async () => {
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: 'p1' }); // findById
    mockPrisma.patient.findFirst.mockResolvedValue({ id: 'p2', email: 'dup@test.com' }); // email dup

    await expect(patientRepository.update('p1', { email: 'dup@test.com' })).rejects.toThrow(ConflictError);
  });

  it('delete deve fazer soft delete do paciente', async () => {
    mockPrisma.patient.findUnique.mockResolvedValueOnce({ id: 'p1' });
    mockPrisma.patient.update.mockResolvedValue({ id: 'p1' });

    await patientRepository.delete('p1');
    expect(mockPrisma.patient.update).toHaveBeenCalled();
  });
});

// ── Appointment Repository ────────────────────────────────────────────────────

describe('appointmentRepository', () => {
  const mockAppointment = {
    id: 'apt1',
    patientId: 'p1',
    doctorId: 'doc1',
    date: new Date('2025-12-25T10:00:00'),
    status: 'CONFIRMED',
    doctor: { id: 'doc1', name: 'Dr. João' },
    patient: { id: 'p1', name: 'Maria' },
  };

  it('findById deve retornar agendamento existente', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(mockAppointment);
    const result = await appointmentRepository.findById('apt1');
    expect(result.id).toBe('apt1');
  });

  it('findById deve lançar NotFoundError se não existir', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(null);
    await expect(appointmentRepository.findById('none')).rejects.toThrow(NotFoundError);
  });

  it('findAll deve retornar lista paginada', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([mockAppointment]);
    mockPrisma.appointment.count.mockResolvedValue(1);
    const result = await appointmentRepository.findAll(10, 0);
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('findByPatientId deve retornar agendamentos do paciente', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([mockAppointment]);
    mockPrisma.appointment.count.mockResolvedValue(1);
    const result = await appointmentRepository.findByPatientId('p1');
    expect(result.data).toHaveLength(1);
  });

  it('findByDoctorId deve retornar agendamentos do médico', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([mockAppointment]);
    mockPrisma.appointment.count.mockResolvedValue(1);
    const result = await appointmentRepository.findByDoctorId('doc1');
    expect(result.data).toHaveLength(1);
  });

  it('findConflicts deve retornar agendamentos conflitantes', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([mockAppointment]);
    const result = await appointmentRepository.findConflicts('doc1', new Date('2025-12-25'));
    expect(result).toHaveLength(1);
    expect(mockPrisma.appointment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ doctorId: 'doc1' }) })
    );
  });

  it('findConflicts com excludeId deve excluir agendamento da verificação', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([]);
    const result = await appointmentRepository.findConflicts('doc1', new Date(), 'apt1');
    expect(mockPrisma.appointment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: { not: 'apt1' } }),
      })
    );
  });

  it('create deve criar novo agendamento', async () => {
    mockPrisma.appointment.create.mockResolvedValue(mockAppointment);
    const result = await appointmentRepository.create({
      patientId: 'p1',
      doctorId: 'doc1',
      date: new Date(),
      status: 'CONFIRMED',
    });
    expect(result.id).toBe('apt1');
  });

  it('update deve atualizar agendamento existente', async () => {
    const updated = { ...mockAppointment, status: 'COMPLETED' };
    mockPrisma.appointment.findUnique.mockResolvedValue(mockAppointment);
    mockPrisma.appointment.update.mockResolvedValue(updated);
    const result = await appointmentRepository.update('apt1', { status: 'COMPLETED' });
    expect(result.status).toBe('COMPLETED');
  });

  it('delete deve remover agendamento existente', async () => {
    mockPrisma.appointment.findUnique.mockResolvedValue(mockAppointment);
    mockPrisma.appointment.delete.mockResolvedValue(mockAppointment);
    await appointmentRepository.delete('apt1');
    expect(mockPrisma.appointment.delete).toHaveBeenCalledWith({ where: { id: 'apt1' } });
  });
});

// ── Medical Record Repository ─────────────────────────────────────────────────

describe('medicalRecordRepository', () => {
  const mockRecord = {
    id: 'mr1',
    mainComplaint: 'Febre alta',
    patientId: 'p1',
    doctorId: 'doc1',
    appointmentId: 'apt1',
    patient: { id: 'p1', name: 'Maria' },
    doctor: { id: 'doc1', name: 'Dr. João', role: 'DOCTOR', specialty: 'Clínica' },
    prescriptions: [],
  };

  it('findById deve retornar prontuário com relacionamentos', async () => {
    mockPrisma.medicalRecord.findUnique.mockResolvedValue(mockRecord);
    const result = await medicalRecordRepository.findById('mr1');
    expect(result.id).toBe('mr1');
    expect(result.patient).toBeDefined();
  });

  it('findById deve lançar NotFoundError se não existir', async () => {
    mockPrisma.medicalRecord.findUnique.mockResolvedValue(null);
    await expect(medicalRecordRepository.findById('none')).rejects.toThrow(NotFoundError);
  });

  it('findAll deve retornar todos os prontuários sem filtros', async () => {
    mockPrisma.medicalRecord.findMany.mockResolvedValue([mockRecord]);
    const result = await medicalRecordRepository.findAll();
    expect(result).toHaveLength(1);
  });

  it('findAll deve aplicar filtro por patientId', async () => {
    mockPrisma.medicalRecord.findMany.mockResolvedValue([mockRecord]);
    await medicalRecordRepository.findAll({ patientId: 'p1' });
    expect(mockPrisma.medicalRecord.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { patientId: 'p1' } })
    );
  });

  it('findByAppointmentId deve retornar prontuário por agendamento', async () => {
    mockPrisma.medicalRecord.findUnique.mockResolvedValue(mockRecord);
    const result = await medicalRecordRepository.findByAppointmentId('apt1');
    expect(result).toEqual(mockRecord);
  });

  it('create deve criar novo prontuário', async () => {
    mockPrisma.medicalRecord.create.mockResolvedValue(mockRecord);
    const result = await medicalRecordRepository.create({
      mainComplaint: 'Febre alta',
      patientId: 'p1',
      doctorId: 'doc1',
      appointmentId: 'apt1',
    });
    expect(result.mainComplaint).toBe('Febre alta');
  });

  it('update deve atualizar prontuário existente', async () => {
    const updated = { ...mockRecord, diagnosis: 'Gripe' };
    mockPrisma.medicalRecord.findUnique.mockResolvedValue(mockRecord);
    mockPrisma.medicalRecord.update.mockResolvedValue(updated);
    const result = await medicalRecordRepository.update('mr1', { diagnosis: 'Gripe' });
    expect(result.diagnosis).toBe('Gripe');
  });

  it('delete deve remover prontuário existente', async () => {
    mockPrisma.medicalRecord.findUnique.mockResolvedValue(mockRecord);
    mockPrisma.medicalRecord.delete.mockResolvedValue(mockRecord);
    await medicalRecordRepository.delete('mr1');
    expect(mockPrisma.medicalRecord.delete).toHaveBeenCalledWith({ where: { id: 'mr1' } });
  });
});

// ── Prescription Repository ───────────────────────────────────────────────────

describe('prescriptionRepository', () => {
  const mockPrescription = {
    id: 'pres1',
    medication: 'Dipirona',
    dosage: '500mg',
    frequency: '6/6h',
    duration: '5 dias',
    medicalRecordId: 'mr1',
    doctorId: 'doc1',
    doctor: { id: 'doc1', name: 'Dr. João', role: 'DOCTOR', specialty: 'Clínica' },
    medicalRecord: { id: 'mr1' },
  };

  it('findByMedicalRecord deve retornar prescrições do prontuário', async () => {
    mockPrisma.prescription.findMany.mockResolvedValue([mockPrescription]);
    const result = await prescriptionRepository.findByMedicalRecord('mr1');
    expect(result).toHaveLength(1);
    expect(result[0].medication).toBe('Dipirona');
  });

  it('findById deve retornar prescrição existente', async () => {
    mockPrisma.prescription.findUnique.mockResolvedValue(mockPrescription);
    const result = await prescriptionRepository.findById('pres1');
    expect(result.medication).toBe('Dipirona');
  });

  it('findById deve lançar NotFoundError se não existir', async () => {
    mockPrisma.prescription.findUnique.mockResolvedValue(null);
    await expect(prescriptionRepository.findById('none')).rejects.toThrow(NotFoundError);
  });

  it('create deve criar nova prescrição', async () => {
    mockPrisma.prescription.create.mockResolvedValue(mockPrescription);
    const result = await prescriptionRepository.create({
      medication: 'Dipirona',
      dosage: '500mg',
      frequency: '6/6h',
      duration: '5 dias',
      doctorId: 'doc1',
      medicalRecordId: 'mr1',
    });
    expect(result.medication).toBe('Dipirona');
  });

  it('update deve atualizar prescrição existente', async () => {
    const updated = { ...mockPrescription, dosage: '1g' };
    mockPrisma.prescription.findUnique.mockResolvedValue(mockPrescription);
    mockPrisma.prescription.update.mockResolvedValue(updated);
    const result = await prescriptionRepository.update('pres1', { dosage: '1g' });
    expect(result.dosage).toBe('1g');
  });

  it('update deve lançar NotFoundError para prescrição inexistente', async () => {
    mockPrisma.prescription.findUnique.mockResolvedValue(null);
    await expect(prescriptionRepository.update('none', { dosage: '1g' })).rejects.toThrow(NotFoundError);
  });

  it('delete deve remover prescrição existente', async () => {
    mockPrisma.prescription.findUnique.mockResolvedValue(mockPrescription);
    mockPrisma.prescription.delete.mockResolvedValue(mockPrescription);
    await prescriptionRepository.delete('pres1');
    expect(mockPrisma.prescription.delete).toHaveBeenCalledWith({ where: { id: 'pres1' } });
  });
});

// ── Exam Repository ───────────────────────────────────────────────────────────

describe('examRepository', () => {
  const mockExam = {
    id: 'exam1',
    name: 'Hemograma',
    type: 'LAB',
    status: 'REQUESTED',
    patientId: 'p1',
    doctorId: 'doc1',
    patient: { id: 'p1', name: 'Maria' },
    doctor: { id: 'doc1', name: 'Dr. João', specialty: 'Clínica' },
  };

  it('findById deve retornar exame existente', async () => {
    mockPrisma.exam.findUnique.mockResolvedValue(mockExam);
    const result = await examRepository.findById('exam1');
    expect(result.name).toBe('Hemograma');
  });

  it('findById deve lançar NotFoundError se não existir', async () => {
    mockPrisma.exam.findUnique.mockResolvedValue(null);
    await expect(examRepository.findById('none')).rejects.toThrow(NotFoundError);
  });

  it('findAll deve retornar lista paginada sem filtros', async () => {
    mockPrisma.exam.findMany.mockResolvedValue([mockExam]);
    mockPrisma.exam.count.mockResolvedValue(1);
    const result = await examRepository.findAll(10, 0);
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('findAll deve aplicar filtros por patientId e doctorId', async () => {
    mockPrisma.exam.findMany.mockResolvedValue([mockExam]);
    mockPrisma.exam.count.mockResolvedValue(1);
    await examRepository.findAll(10, 0, { patientId: 'p1', doctorId: 'doc1' } as any);
    expect(mockPrisma.exam.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { patientId: 'p1', doctorId: 'doc1' } })
    );
  });

  it('create deve criar novo exame', async () => {
    mockPrisma.exam.create.mockResolvedValue(mockExam);
    const result = await examRepository.create({
      name: 'Hemograma',
      type: 'LAB' as any,
      patientId: 'p1',
      doctorId: 'doc1',
    } as any);
    expect(result.name).toBe('Hemograma');
  });

  it('update deve atualizar exame existente', async () => {
    const updated = { ...mockExam, status: 'COMPLETED' };
    mockPrisma.exam.findUnique.mockResolvedValue(mockExam);
    mockPrisma.exam.update.mockResolvedValue(updated);
    const result = await examRepository.update('exam1', { status: 'COMPLETED' as any });
    expect(result.status).toBe('COMPLETED');
  });

  it('delete deve remover exame', async () => {
    mockPrisma.exam.findUnique.mockResolvedValue(mockExam);
    mockPrisma.exam.delete.mockResolvedValue(mockExam);
    await examRepository.delete('exam1');
    expect(mockPrisma.exam.delete).toHaveBeenCalledWith({ where: { id: 'exam1' } });
  });
});

// ── Specialty Repository ──────────────────────────────────────────────────────

describe('specialtyRepository', () => {
  const mockSpecialty = { id: 'spec1', name: 'Cardiologia', isActive: true };

  it('findById deve retornar especialidade existente', async () => {
    mockPrisma.specialty.findUnique.mockResolvedValue(mockSpecialty);
    const result = await specialtyRepository.findById('spec1');
    expect(result.name).toBe('Cardiologia');
  });

  it('findById deve lançar NotFoundError se não existir', async () => {
    mockPrisma.specialty.findUnique.mockResolvedValue(null);
    await expect(specialtyRepository.findById('none')).rejects.toThrow(NotFoundError);
  });

  it('findAll deve retornar lista paginada', async () => {
    mockPrisma.specialty.findMany.mockResolvedValue([mockSpecialty]);
    mockPrisma.specialty.count.mockResolvedValue(1);
    const result = await specialtyRepository.findAll(10, 0);
    expect(result.data).toHaveLength(1);
  });

  it('findByName deve retornar especialidade pelo nome', async () => {
    mockPrisma.specialty.findUnique.mockResolvedValue(mockSpecialty);
    const result = await specialtyRepository.findByName('Cardiologia');
    expect(result).toEqual(mockSpecialty);
  });

  it('create deve criar nova especialidade', async () => {
    mockPrisma.specialty.create.mockResolvedValue(mockSpecialty);
    const result = await specialtyRepository.create({ name: 'Cardiologia' });
    expect(result.name).toBe('Cardiologia');
  });

  it('update deve atualizar especialidade existente', async () => {
    const updated = { ...mockSpecialty, name: 'Cardiologia Avançada' };
    mockPrisma.specialty.findUnique.mockResolvedValue(mockSpecialty);
    mockPrisma.specialty.findFirst.mockResolvedValue(null);
    mockPrisma.specialty.update.mockResolvedValue(updated);
    const result = await specialtyRepository.update('spec1', { name: 'Cardiologia Avançada' });
    expect(result.name).toBe('Cardiologia Avançada');
  });

  it('delete deve desativar especialidade (soft delete via isActive=false)', async () => {
    const deactivated = { ...mockSpecialty, isActive: false };
    mockPrisma.specialty.findUnique.mockResolvedValueOnce(mockSpecialty);
    mockPrisma.specialty.update.mockResolvedValue(deactivated);
    const result = await specialtyRepository.delete('spec1');
    expect(mockPrisma.specialty.update).toHaveBeenCalledWith({
      where: { id: 'spec1' },
      data: { isActive: false },
    });
    expect(result.isActive).toBe(false);
  });
});

// ── Health Plan Repository ────────────────────────────────────────────────────

describe('healthPlanRepository', () => {
  const mockPlan = {
    id: 'plan1',
    planName: 'Plano Ouro',
    provider: 'Unimed',
    planNumber: '123456',
    isActive: true,
    patientId: 'p1',
  };

  it('findById deve retornar convênio existente', async () => {
    mockPrisma.healthPlan.findUnique.mockResolvedValue(mockPlan);
    const result = await healthPlanRepository.findById('plan1');
    expect(result.planName).toBe('Plano Ouro');
  });

  it('findById deve lançar NotFoundError se não existir', async () => {
    mockPrisma.healthPlan.findUnique.mockResolvedValue(null);
    await expect(healthPlanRepository.findById('none')).rejects.toThrow(NotFoundError);
  });

  it('findAll deve retornar lista paginada', async () => {
    mockPrisma.healthPlan.findMany.mockResolvedValue([mockPlan]);
    mockPrisma.healthPlan.count.mockResolvedValue(1);
    const result = await healthPlanRepository.findAll(10, 0);
    expect(result.data).toHaveLength(1);
  });

  it('findAll deve filtrar por patientId', async () => {
    mockPrisma.healthPlan.findMany.mockResolvedValue([mockPlan]);
    mockPrisma.healthPlan.count.mockResolvedValue(1);
    await healthPlanRepository.findAll(10, 0, 'p1');
    expect(mockPrisma.healthPlan.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { patientId: 'p1' } })
    );
  });

  it('findByPlanNumber deve retornar convênio pelo número', async () => {
    mockPrisma.healthPlan.findUnique.mockResolvedValue(mockPlan);
    const result = await healthPlanRepository.findByPlanNumber('123456');
    expect(result).toEqual(mockPlan);
  });

  it('create deve criar novo convênio', async () => {
    // findByPlanNumber (findUnique) returns null → no conflict
    mockPrisma.healthPlan.findUnique.mockResolvedValue(null);
    mockPrisma.healthPlan.create.mockResolvedValue(mockPlan);
    const result = await healthPlanRepository.create({
      planName: 'Plano Ouro',
      provider: 'Unimed',
      planNumber: '123456',
      validUntil: new Date('2026-12-31'),
      patientId: 'p1',
    });
    expect(result.planName).toBe('Plano Ouro');
  });

  it('update deve atualizar convênio existente', async () => {
    const updated = { ...mockPlan, planName: 'Plano Diamante' };
    // findById (findUnique with id)
    mockPrisma.healthPlan.findUnique.mockResolvedValue(mockPlan);
    // findFirst for planNumber conflict check → null = no conflict
    mockPrisma.healthPlan.findFirst.mockResolvedValue(null);
    mockPrisma.healthPlan.update.mockResolvedValue(updated);
    const result = await healthPlanRepository.update('plan1', { planName: 'Plano Diamante' });
    expect(result.planName).toBe('Plano Diamante');
  });

  it('delete deve remover convênio', async () => {
    mockPrisma.healthPlan.findUnique.mockResolvedValue(mockPlan);
    mockPrisma.healthPlan.delete.mockResolvedValue(mockPlan);
    await healthPlanRepository.delete('plan1');
    expect(mockPrisma.healthPlan.delete).toHaveBeenCalledWith({ where: { id: 'plan1' } });
  });
});
