/**
 * Testes adicionais para os serviços não cobertos pelos testes existentes.
 * Cobre: userService, patientService, appointmentService,
 *        medicalRecordService, prescriptionService.
 */

import {
  userService,
  patientService,
  appointmentService,
  medicalRecordService,
  prescriptionService,
} from '../../src/services';
import { ValidationError, NotFoundError, ConflictError } from '../../src/utils/errors';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('../../src/repositories', () => ({
  userRepository: {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
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

jest.mock('axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
  get: jest.fn(),
}));

// ── User Service ──────────────────────────────────────────────────────────────

describe('User Service', () => {
  const { userRepository } = require('../../src/repositories');

  beforeEach(() => jest.clearAllMocks());

  it('getAllUsers deve retornar lista paginada', async () => {
    userRepository.findAll.mockResolvedValue({ data: [{ id: 'u1' }], total: 1 });
    const result = await userService.getAllUsers(10, 0);
    expect(result.data).toHaveLength(1);
    expect(userRepository.findAll).toHaveBeenCalledWith(10, 0, undefined);
  });

  it('getAllUsers deve filtrar por role', async () => {
    userRepository.findAll.mockResolvedValue({ data: [], total: 0 });
    await userService.getAllUsers(10, 0, 'DOCTOR');
    expect(userRepository.findAll).toHaveBeenCalledWith(10, 0, 'DOCTOR');
  });

  it('getUserById deve retornar usuário existente', async () => {
    const mockUser = { id: 'u1', name: 'Dr. João', role: 'DOCTOR' };
    userRepository.findById.mockResolvedValue(mockUser);
    const result = await userService.getUserById('u1');
    expect(result).toEqual(mockUser);
  });

  it('getUserById deve lançar NotFoundError para usuário inexistente', async () => {
    userRepository.findById.mockRejectedValue(new NotFoundError('Usuário'));
    await expect(userService.getUserById('none')).rejects.toThrow(NotFoundError);
  });

  it('updateUser deve atualizar e retornar usuário', async () => {
    const updated = { id: 'u1', name: 'Dr. Silva' };
    userRepository.update.mockResolvedValue(updated);
    const result = await userService.updateUser('u1', { name: 'Dr. Silva' });
    expect(result.name).toBe('Dr. Silva');
  });

  it('deleteUser deve desativar o usuário', async () => {
    userRepository.delete.mockResolvedValue(undefined);
    await userService.deleteUser('u1');
    expect(userRepository.delete).toHaveBeenCalledWith('u1');
  });
});

// ── Patient Service ───────────────────────────────────────────────────────────

describe('Patient Service', () => {
  const { patientRepository } = require('../../src/repositories');
  const axiosMock = require('axios').default;

  beforeEach(() => jest.clearAllMocks());

  it('getAllPatients deve retornar lista paginada', async () => {
    patientRepository.findAll.mockResolvedValue({ data: [{ id: 'p1' }], total: 1 });
    const result = await patientService.getAllPatients(10, 0);
    expect(result.data).toHaveLength(1);
  });

  it('getPatientById deve retornar paciente existente', async () => {
    const mockPatient = { id: 'p1', name: 'João Silva', cpf: '11144477735' };
    patientRepository.findById.mockResolvedValue(mockPatient);
    const result = await patientService.getPatientById('p1');
    expect(result).toEqual(mockPatient);
  });

  it('searchPatients deve buscar pacientes por query', async () => {
    patientRepository.search.mockResolvedValue([{ id: 'p1', name: 'João' }]);
    const result = await patientService.searchPatients('João', 10);
    expect(result).toHaveLength(1);
    expect(patientRepository.search).toHaveBeenCalledWith('João', 10);
  });

  it('searchPatients deve rejeitar query vazia', async () => {
    await expect(patientService.searchPatients('')).rejects.toThrow(ValidationError);
  });

  it('searchPatients deve rejeitar query só com espaços', async () => {
    await expect(patientService.searchPatients('   ')).rejects.toThrow(ValidationError);
  });

  it('createPatient deve criar paciente com coordenadas via Nominatim', async () => {
    axiosMock.get.mockResolvedValue({
      data: [{ lat: '-23.5505', lon: '-46.6333' }],
    });
    const mockPatient = { id: 'p1', name: 'Maria', cpf: '00000000191' };
    patientRepository.create.mockResolvedValue(mockPatient);

    const result = await patientService.createPatient({
      name: 'Maria',
      cpf: '00000000191',
      birthDate: '1990-01-01',
      gender: 'F',
      phone: '11999999999',
      email: 'maria@example.com',
      address: 'Av. Paulista, 1000, São Paulo',
    });
    expect(result).toEqual(mockPatient);
  });

  it('createPatient deve criar paciente mesmo sem coordenadas', async () => {
    axiosMock.get.mockRejectedValue(new Error('API indisponível'));
    const mockPatient = { id: 'p2', name: 'Pedro', cpf: '00000000191' };
    patientRepository.create.mockResolvedValue(mockPatient);

    const result = await patientService.createPatient({
      name: 'Pedro',
      cpf: '00000000191',
      birthDate: '1985-06-15',
      gender: 'M',
      phone: '11988888888',
      email: 'pedro@example.com',
      address: 'Rua X, 1',
    });
    expect(result).toEqual(mockPatient);
  });

  it('createPatient deve rejeitar dados inválidos', async () => {
    await expect(patientService.createPatient({ name: '' })).rejects.toThrow(ValidationError);
  });

  it('updatePatient deve atualizar paciente', async () => {
    const updated = { id: 'p1', name: 'João Atualizado' };
    patientRepository.update.mockResolvedValue(updated);
    const result = await patientService.updatePatient('p1', { name: 'João Atualizado' });
    expect(result.name).toBe('João Atualizado');
  });

  it('updatePatient deve recalcular coordenadas ao mudar endereço', async () => {
    axiosMock.get.mockResolvedValue({ data: [{ lat: '-23.5', lon: '-46.6' }] });
    const updated = { id: 'p1', address: 'Nova Rua', latitude: -23.5, longitude: -46.6 };
    patientRepository.update.mockResolvedValue(updated);
    const result = await patientService.updatePatient('p1', { address: 'Nova Rua' });
    expect(result.address).toBe('Nova Rua');
  });

  it('updatePatient deve converter birthDate para Date', async () => {
    const updated = { id: 'p1', birthDate: new Date('1990-01-01') };
    patientRepository.update.mockResolvedValue(updated);
    await patientService.updatePatient('p1', { birthDate: '1990-01-01' });
    expect(patientRepository.update).toHaveBeenCalledWith(
      'p1',
      expect.objectContaining({ birthDate: expect.any(Date) })
    );
  });

  it('deletePatient deve remover paciente', async () => {
    patientRepository.delete.mockResolvedValue(undefined);
    await patientService.deletePatient('p1');
    expect(patientRepository.delete).toHaveBeenCalledWith('p1');
  });

  it('getNearbyClinic deve retornar clínicas próximas', async () => {
    patientRepository.findById.mockResolvedValue({
      id: 'p1', latitude: -23.5505, longitude: -46.6333,
    });
    axiosMock.get.mockResolvedValue({ data: { elements: [{ id: 1, type: 'node' }] } });
    const result = await patientService.getNearbyClinic('p1');
    expect(result).toHaveLength(1);
  });

  it('getNearbyClinic deve lançar erro se paciente não tem coordenadas', async () => {
    patientRepository.findById.mockResolvedValue({ id: 'p1', latitude: null, longitude: null });
    await expect(patientService.getNearbyClinic('p1')).rejects.toThrow(ValidationError);
  });
});

// ── Appointment Service ───────────────────────────────────────────────────────

describe('Appointment Service', () => {
  const {
    appointmentRepository,
    patientRepository,
    userRepository,
  } = require('../../src/repositories');

  beforeEach(() => jest.clearAllMocks());

  it('getAllAppointments deve retornar lista paginada', async () => {
    appointmentRepository.findAll.mockResolvedValue({ data: [{ id: 'apt1' }], total: 1 });
    const result = await appointmentService.getAllAppointments();
    expect(result.data).toHaveLength(1);
  });

  it('getAppointmentById deve retornar agendamento existente', async () => {
    const mockApt = { id: 'apt1', status: 'CONFIRMED' };
    appointmentRepository.findById.mockResolvedValue(mockApt);
    const result = await appointmentService.getAppointmentById('apt1');
    expect(result).toEqual(mockApt);
  });

  it('getPatientAppointments deve retornar agendamentos do paciente', async () => {
    patientRepository.findById.mockResolvedValue({ id: 'p1' });
    appointmentRepository.findByPatientId.mockResolvedValue({ data: [{ id: 'apt1' }], total: 1 });
    const result = await appointmentService.getPatientAppointments('p1');
    expect(result.data).toHaveLength(1);
  });

  it('getDoctorAppointments deve retornar agendamentos do médico', async () => {
    userRepository.findById.mockResolvedValue({ id: 'doc1' });
    appointmentRepository.findByDoctorId.mockResolvedValue({ data: [{ id: 'apt1' }], total: 1 });
    const result = await appointmentService.getDoctorAppointments('doc1');
    expect(result.data).toHaveLength(1);
  });

  it('createAppointment deve criar agendamento sem conflitos', async () => {
    patientRepository.findById.mockResolvedValue({ id: 'p1' });
    userRepository.findById.mockResolvedValue({ id: 'doc1', role: 'DOCTOR' });
    appointmentRepository.findConflicts.mockResolvedValue([]);
    const mockApt = { id: 'apt1', status: 'CONFIRMED' };
    appointmentRepository.create.mockResolvedValue(mockApt);

    const futureDate = new Date(Date.now() + 86400000).toISOString(); // +1 dia
    const result = await appointmentService.createAppointment({
      patientId: 'p1',
      doctorId: 'doc1',
      date: futureDate,
    });
    expect(result.status).toBe('CONFIRMED');
  });

  it('createAppointment deve rejeitar quando há conflito de horário', async () => {
    patientRepository.findById.mockResolvedValue({ id: 'p1' });
    userRepository.findById.mockResolvedValue({ id: 'doc1', role: 'DOCTOR' });
    appointmentRepository.findConflicts.mockResolvedValue([{ id: 'existing-apt' }]);

    const futureDate = new Date(Date.now() + 86400000).toISOString();
    await expect(
      appointmentService.createAppointment({
        patientId: 'p1',
        doctorId: 'doc1',
        date: futureDate,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('createAppointment deve rejeitar dados inválidos', async () => {
    await expect(
      appointmentService.createAppointment({ doctorId: 'doc1' })
    ).rejects.toThrow(ValidationError);
  });

  it('updateAppointment deve atualizar agendamento', async () => {
    const existingApt = { id: 'apt1', doctorId: 'doc1', status: 'CONFIRMED' };
    const updatedApt = { ...existingApt, status: 'COMPLETED' };
    appointmentRepository.findById.mockResolvedValue(existingApt);
    appointmentRepository.update.mockResolvedValue(updatedApt);

    const result = await appointmentService.updateAppointment('apt1', { status: 'COMPLETED' });
    expect(result.status).toBe('COMPLETED');
  });

  it('updateAppointment com nova data deve verificar conflitos', async () => {
    const existingApt = { id: 'apt1', doctorId: 'doc1', status: 'CONFIRMED' };
    appointmentRepository.findById.mockResolvedValue(existingApt);
    appointmentRepository.findConflicts.mockResolvedValue([]);
    appointmentRepository.update.mockResolvedValue(existingApt);

    await appointmentService.updateAppointment('apt1', {
      date: new Date().toISOString(),
      doctorId: 'doc1',
    });
    expect(appointmentRepository.findConflicts).toHaveBeenCalled();
  });

  it('cancelAppointment deve alterar status para CANCELLED', async () => {
    const cancelled = { id: 'apt1', status: 'CANCELLED', notes: 'Paciente desistiu' };
    appointmentRepository.update.mockResolvedValue(cancelled);
    const result = await appointmentService.cancelAppointment('apt1', 'Paciente desistiu');
    expect(result.status).toBe('CANCELLED');
  });

  it('getAvailableSlots deve retornar horários disponíveis', async () => {
    userRepository.findById.mockResolvedValue({ id: 'doc1' });
    appointmentRepository.findConflicts.mockResolvedValue([]);
    const result = await appointmentService.getAvailableSlots('doc1', '2025-12-25');
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toMatch(/^\d{2}:00$/);
  });

  it('getAvailableSlots deve retornar no máximo 9 slots (8h-16h)', async () => {
    userRepository.findById.mockResolvedValue({ id: 'doc1' });
    appointmentRepository.findConflicts.mockResolvedValue([]);
    const result = await appointmentService.getAvailableSlots('doc1', '2025-12-25');
    expect(result.length).toBeLessThanOrEqual(9);
    expect(result.every((s: string) => /^\d{2}:00$/.test(s))).toBe(true);
  });
});

// ── Medical Record Service ────────────────────────────────────────────────────

describe('Medical Record Service', () => {
  const {
    medicalRecordRepository,
    patientRepository,
    userRepository,
  } = require('../../src/repositories');

  beforeEach(() => jest.clearAllMocks());

  it('getAll deve retornar todos os prontuários', async () => {
    medicalRecordRepository.findAll.mockResolvedValue([{ id: 'mr1' }]);
    const result = await medicalRecordService.getAll();
    expect(result).toHaveLength(1);
  });

  it('getAll deve aceitar filtros', async () => {
    medicalRecordRepository.findAll.mockResolvedValue([]);
    await medicalRecordService.getAll({ patientId: 'p1' });
    expect(medicalRecordRepository.findAll).toHaveBeenCalledWith({ patientId: 'p1' });
  });

  it('getById deve retornar prontuário existente', async () => {
    const mock = { id: 'mr1', mainComplaint: 'Dor de cabeça' };
    medicalRecordRepository.findById.mockResolvedValue(mock);
    const result = await medicalRecordService.getById('mr1');
    expect(result.mainComplaint).toBe('Dor de cabeça');
  });

  it('create deve criar prontuário com dados válidos', async () => {
    patientRepository.findById.mockResolvedValue({ id: 'p1' });
    userRepository.findById.mockResolvedValue({ id: 'doc1', role: 'DOCTOR' });
    medicalRecordRepository.findByAppointmentId.mockResolvedValue(null);
    const mockRecord = { id: 'mr1', mainComplaint: 'Febre', patientId: 'p1' };
    medicalRecordRepository.create.mockResolvedValue(mockRecord);

    const result = await medicalRecordService.create({
      mainComplaint: 'Febre',
      patientId: 'p1',
      doctorId: 'doc1',
      appointmentId: 'apt1',
    });
    expect(result.mainComplaint).toBe('Febre');
  });

  it('create deve rejeitar quando agendamento já tem prontuário', async () => {
    patientRepository.findById.mockResolvedValue({ id: 'p1' });
    userRepository.findById.mockResolvedValue({ id: 'doc1' });
    medicalRecordRepository.findByAppointmentId.mockResolvedValue({ id: 'existing-mr' });

    await expect(
      medicalRecordService.create({
        mainComplaint: 'Febre',
        patientId: 'p1',
        doctorId: 'doc1',
        appointmentId: 'apt1',
      })
    ).rejects.toThrow(ConflictError);
  });

  it('create deve rejeitar dados inválidos', async () => {
    await expect(medicalRecordService.create({ patientId: 'p1' })).rejects.toThrow(ValidationError);
  });

  it('update deve atualizar prontuário', async () => {
    const updated = { id: 'mr1', diagnosis: 'Gripe' };
    medicalRecordRepository.update.mockResolvedValue(updated);
    const result = await medicalRecordService.update('mr1', { diagnosis: 'Gripe' });
    expect(result.diagnosis).toBe('Gripe');
  });

  it('delete deve remover prontuário', async () => {
    medicalRecordRepository.delete.mockResolvedValue(undefined);
    await medicalRecordService.delete('mr1');
    expect(medicalRecordRepository.delete).toHaveBeenCalledWith('mr1');
  });
});

// ── Prescription Service ──────────────────────────────────────────────────────

describe('Prescription Service', () => {
  const {
    prescriptionRepository,
    medicalRecordRepository,
    userRepository,
  } = require('../../src/repositories');

  beforeEach(() => jest.clearAllMocks());

  it('getByMedicalRecord deve retornar prescrições do prontuário', async () => {
    medicalRecordRepository.findById.mockResolvedValue({ id: 'mr1' });
    prescriptionRepository.findByMedicalRecord.mockResolvedValue([{ id: 'pres1' }]);
    const result = await prescriptionService.getByMedicalRecord('mr1');
    expect(result).toHaveLength(1);
  });

  it('getById deve retornar prescrição existente', async () => {
    const mock = { id: 'pres1', medication: 'Dipirona' };
    prescriptionRepository.findById.mockResolvedValue(mock);
    const result = await prescriptionService.getById('pres1');
    expect(result.medication).toBe('Dipirona');
  });

  it('create deve criar prescrição com dados válidos', async () => {
    medicalRecordRepository.findById.mockResolvedValue({ id: 'mr1' });
    userRepository.findById.mockResolvedValue({ id: 'doc1', role: 'DOCTOR' });
    const mockPres = { id: 'pres1', medication: 'Amoxicilina', dosage: '500mg' };
    prescriptionRepository.create.mockResolvedValue(mockPres);

    const result = await prescriptionService.create({
      medication: 'Amoxicilina',
      dosage: '500mg',
      frequency: '8/8h',
      duration: '7 dias',
      medicalRecordId: 'mr1',
      doctorId: 'doc1',
    });
    expect(result.medication).toBe('Amoxicilina');
  });

  it('create deve rejeitar dados inválidos', async () => {
    await expect(prescriptionService.create({ medicalRecordId: 'mr1' })).rejects.toThrow(ValidationError);
  });

  it('update deve atualizar prescrição', async () => {
    const updated = { id: 'pres1', dosage: '750mg' };
    prescriptionRepository.update.mockResolvedValue(updated);
    const result = await prescriptionService.update('pres1', { dosage: '750mg' });
    expect(result.dosage).toBe('750mg');
  });

  it('delete deve remover prescrição', async () => {
    prescriptionRepository.delete.mockResolvedValue(undefined);
    await prescriptionService.delete('pres1');
    expect(prescriptionRepository.delete).toHaveBeenCalledWith('pres1');
  });
});
