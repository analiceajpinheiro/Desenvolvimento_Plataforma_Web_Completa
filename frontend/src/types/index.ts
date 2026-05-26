// Tipos da aplicação VitaLink

export enum UserRole {
  DOCTOR = 'DOCTOR',
  RECEPTIONIST = 'RECEPTIONIST',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  specialty?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export enum AppointmentStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  RESCHEDULED = 'RESCHEDULED',
}

export interface Appointment {
  id: string;
  date: string;
  status: AppointmentStatus;
  notes?: string;
  doctorId: string;
  patientId: string;
  doctor?: User;
  patient?: Patient;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  mainComplaint: string;
  history?: string;
  physicalExam?: string;
  diagnosis?: string;
  treatment?: string;
  doctorId: string;
  patientId: string;
  appointmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  doctorId: string;
  medicalRecordId: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ===== SPRINT 3: NOVOS TIPOS =====

export enum ExamType {
  LAB = 'LAB',
  IMAGE = 'IMAGE',
  FUNCTIONAL = 'FUNCTIONAL',
  OTHER = 'OTHER',
}

export enum ExamStatus {
  REQUESTED = 'REQUESTED',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Exam {
  id: string;
  name: string;
  type: ExamType;
  description?: string;
  result?: string;
  status: ExamStatus;
  scheduledAt?: string;
  completedAt?: string;
  patientId: string;
  doctorId: string;
  patient?: Pick<Patient, 'id' | 'name' | 'cpf'>;
  doctor?: Pick<User, 'id' | 'name' | 'specialty'>;
  createdAt: string;
  updatedAt: string;
}

export interface Specialty {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HealthPlan {
  id: string;
  planName: string;
  provider: string;
  planNumber: string;
  validUntil: string;
  notes?: string;
  isActive: boolean;
  patientId: string;
  patient?: Pick<Patient, 'id' | 'name' | 'cpf'>;
  createdAt: string;
  updatedAt: string;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  address: string;
}
