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
