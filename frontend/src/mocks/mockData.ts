import { Patient, Appointment, User } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'João Silva',
    cpf: '12345678901',
    birthDate: '1990-05-15T00:00:00.000Z',
    gender: 'M',
    phone: '11987654321',
    email: 'joao@example.com',
    address: 'Rua A, 123 - São Paulo, SP',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Maria Santos',
    cpf: '98765432109',
    birthDate: '1995-08-22T00:00:00.000Z',
    gender: 'F',
    phone: '11991234567',
    email: 'maria@example.com',
    address: 'Avenida B, 456 - São Paulo, SP',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Pedro Costa',
    cpf: '55566677788',
    birthDate: '1985-03-10T00:00:00.000Z',
    gender: 'M',
    phone: '11988776655',
    email: 'pedro@example.com',
    address: 'Rua C, 789 - São Paulo, SP',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: new Date(Date.now() + 86400000).toISOString(),
    status: 'CONFIRMED',
    doctorId: 'doc1',
    patientId: '1',
    notes: 'Consulta de rotina',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    date: new Date(Date.now() + 172800000).toISOString(),
    status: 'CONFIRMED',
    doctorId: 'doc2',
    patientId: '2',
    notes: 'Acompanhamento',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockDoctors: User[] = [
  {
    id: 'doc1',
    email: 'dr.joao@clinic.com',
    name: 'Dr. João Cardiologista',
    password: 'hashed_password',
    role: 'DOCTOR',
    specialty: 'Cardiologia',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'doc2',
    email: 'dra.maria@clinic.com',
    name: 'Dra. Maria Pediatra',
    password: 'hashed_password',
    role: 'DOCTOR',
    specialty: 'Pediatria',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
