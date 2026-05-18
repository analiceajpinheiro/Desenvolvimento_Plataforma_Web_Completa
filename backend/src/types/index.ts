export interface IUser {
  id: string;
  email: string;
  name: string;
  role: 'DOCTOR' | 'RECEPTIONIST' | 'ADMIN';
  specialty?: string;
  isActive: boolean;
}

export interface IPatient {
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
}

export interface IAppointment {
  id: string;
  date: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'RESCHEDULED';
  notes?: string;
  doctorId: string;
  patientId: string;
}

export interface IMedicalRecord {
  id: string;
  mainComplaint: string;
  history?: string;
  physicalExam?: string;
  diagnosis?: string;
  treatment?: string;
  doctorId: string;
  patientId: string;
  appointmentId: string;
}

export interface IPrescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
  doctorId: string;
  medicalRecordId: string;
}
