// Validadores e helpers
import { ValidationError } from './errors';

export const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

  return true;
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11;
};

export const validatePassword = (password: string): boolean => {
  // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
};

export const validateDateFormat = (date: string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const validateCreatePatientInput = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Nome é obrigatório';
  }

  if (!validateCPF(data.cpf || '')) {
    errors.cpf = 'CPF inválido';
  }

  if (!data.birthDate || !validateDateFormat(data.birthDate)) {
    errors.birthDate = 'Data de nascimento inválida';
  }

  if (!['M', 'F', 'O'].includes(data.gender)) {
    errors.gender = 'Gênero inválido';
  }

  if (!validatePhone(data.phone || '')) {
    errors.phone = 'Telefone inválido (deve conter 11 dígitos)';
  }

  if (!validateEmail(data.email || '')) {
    errors.email = 'Email inválido';
  }

  if (!data.address || data.address.trim().length === 0) {
    errors.address = 'Endereço é obrigatório';
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(JSON.stringify(errors));
  }
};

export const validateCreateUserInput = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Nome é obrigatório';
  }

  if (!validateEmail(data.email || '')) {
    errors.email = 'Email inválido';
  }

  if (!validatePassword(data.password || '')) {
    errors.password = 'Senha deve ter no mínimo 8 caracteres, com letra maiúscula, minúscula e número';
  }

  if (!['DOCTOR', 'RECEPTIONIST', 'ADMIN'].includes(data.role)) {
    errors.role = 'Role inválido';
  }

  if (data.role === 'DOCTOR' && (!data.specialty || data.specialty.trim().length === 0)) {
    errors.specialty = 'Especialidade é obrigatória para médicos';
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(JSON.stringify(errors));
  }
};

export const validateCreateAppointmentInput = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.date || !validateDateFormat(data.date)) {
    errors.date = 'Data inválida';
  }

  // Validar se a data é no futuro
  if (data.date && new Date(data.date) <= new Date()) {
    errors.date = 'A data deve ser no futuro';
  }

  if (!data.doctorId || data.doctorId.trim().length === 0) {
    errors.doctorId = 'Médico é obrigatório';
  }

  if (!data.patientId || data.patientId.trim().length === 0) {
    errors.patientId = 'Paciente é obrigatório';
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(JSON.stringify(errors));
  }
};

export const validateCreateMedicalRecordInput = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.mainComplaint || data.mainComplaint.trim().length === 0) {
    errors.mainComplaint = 'Queixa principal é obrigatória';
  }

  if (!data.patientId || data.patientId.trim().length === 0) {
    errors.patientId = 'Paciente é obrigatório';
  }

  if (!data.doctorId || data.doctorId.trim().length === 0) {
    errors.doctorId = 'Médico é obrigatório';
  }

  if (data.appointmentId !== undefined && data.appointmentId.trim().length === 0) {
    errors.appointmentId = 'ID do agendamento inválido';
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(JSON.stringify(errors));
  }
};

export const validateCreatePrescriptionInput = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.medication || data.medication.trim().length === 0) {
    errors.medication = 'Medicamento é obrigatório';
  }

  if (!data.dosage || data.dosage.trim().length === 0) {
    errors.dosage = 'Dosagem é obrigatória';
  }

  if (!data.frequency || data.frequency.trim().length === 0) {
    errors.frequency = 'Frequência é obrigatória';
  }

  if (!data.duration || data.duration.trim().length === 0) {
    errors.duration = 'Duração é obrigatória';
  }

  if (!data.medicalRecordId || data.medicalRecordId.trim().length === 0) {
    errors.medicalRecordId = 'ID do prontuário é obrigatório';
  }

  if (!data.doctorId || data.doctorId.trim().length === 0) {
    errors.doctorId = 'Médico é obrigatório';
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(JSON.stringify(errors));
  }
};
