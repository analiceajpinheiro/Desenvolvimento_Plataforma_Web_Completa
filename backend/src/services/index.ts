import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository, patientRepository, appointmentRepository } from '../repositories';
import { examRepository, specialtyRepository, healthPlanRepository } from '../repositories';
import {
  validateCreateUserInput,
  validateCreatePatientInput,
  validateCreateAppointmentInput,
  validateCreateExamInput,
  validateCreateSpecialtyInput,
  validateCreateHealthPlanInput,
} from '../utils/validators';
import {
  UnauthorizedError,
  ValidationError,
  NotFoundError,
} from '../utils/errors';
import axios from 'axios';
import { medicalRecordRepository } from '../repositories';
import { prescriptionRepository } from '../repositories';
import { validateCreateMedicalRecordInput } from '../utils/validators';
import { validateCreatePrescriptionInput } from '../utils/validators';
import { ConflictError } from '../utils/errors';

// ===== AUTH SERVICE =====
export const authService = {
  async register(userData: any) {
    validateCreateUserInput(userData);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id);
    return { user, token };
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Email ou senha inválidos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Email ou senha inválidos');
    }

    const token = this.generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  generateToken(userId: string) {
    const secret = process.env.JWT_SECRET || 'secret-key-change-in-production';
    return jwt.sign({ userId }, secret, { expiresIn: '24h' });
  },

  verifyToken(token: string) {
    const secret = process.env.JWT_SECRET || 'secret-key-change-in-production';
    try {
      const decoded = jwt.verify(token, secret) as { userId: string };
      return decoded.userId;
    } catch {
      throw new UnauthorizedError('Token inválido ou expirado');
    }
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId);
    
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Senha atual inválida');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await userRepository.update(userId, { password: hashedPassword });
  },
};

// ===== USER SERVICE =====
export const userService = {
  async getAllUsers(limit = 10, skip = 0, role?: string) {
    return await userRepository.findAll(limit, skip, role);
  },

  async getUserById(id: string) {
    return await userRepository.findById(id);
  },

  async updateUser(id: string, data: any) {
    return await userRepository.update(id, data);
  },

  async deleteUser(id: string) {
    return await userRepository.delete(id);
  },
};

// ===== PATIENT SERVICE =====
export const patientService = {
  async getAllPatients(limit = 10, skip = 0) {
    return await patientRepository.findAll(limit, skip);
  },

  async getPatientById(id: string) {
    return await patientRepository.findById(id);
  },

  async searchPatients(query: string, limit = 10) {
    if (!query || query.trim().length === 0) {
      throw new ValidationError('Query de busca é obrigatória');
    }
    return await patientRepository.search(query, limit);
  },

  async createPatient(data: any) {
    validateCreatePatientInput(data);
    
    // Integração com API de geolocalização (Nominatim)
    let coordinates: { latitude: number | null; longitude: number | null } = { latitude: null, longitude: null };
    try {
      const coords = await this.getCoordinates(data.address);
      if (coords && coords.latitude !== null && coords.longitude !== null) {
        coordinates = coords;
      }
    } catch (err) {
      console.warn('Falha ao obter coordenadas:', err);
    }

    return await patientRepository.create({
      ...data,
      birthDate: new Date(data.birthDate),
      ...coordinates,
    });
  },

  async updatePatient(id: string, data: any) {
    if (data.birthDate) {
      data.birthDate = new Date(data.birthDate);
    }

    if (data.address) {
      try {
        const coordinates = await this.getCoordinates(data.address);
        data = { ...data, ...coordinates };
      } catch (err) {
        console.warn('Falha ao obter coordenadas:', err);
      }
    }

    return await patientRepository.update(id, data);
  },

  async deletePatient(id: string) {
    return await patientRepository.delete(id);
  },

  async getNearbyClinic(patientId: string) {
    const patient = await patientRepository.findById(patientId);
    
    if (!patient.latitude || !patient.longitude) {
      throw new ValidationError('Coordenadas do paciente não disponíveis');
    }

    return await this.findNearbyPlaces(
      patient.latitude,
      patient.longitude,
      'clinic'
    );
  },

  async getCoordinates(address: string) {
    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: address,
            format: 'json',
            limit: 1,
          },
          headers: {
            'User-Agent': 'VitaLink-App',
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        };
      }

      return { latitude: null, longitude: null };
    } catch (err) {
      console.error('Erro ao obter coordenadas:', err);
      return { latitude: null, longitude: null };
    }
  },

  async findNearbyPlaces(
    latitude: number,
    longitude: number,
    type: string,
    radius = 5000
  ) {
    try {
      // Usando Overpass API para buscar locais próximos
      const query = `
        [bbox:${latitude - 0.05},${longitude - 0.05},${latitude + 0.05},${longitude + 0.05}];
        (
          node["amenity"="${type}"];
          way["amenity"="${type}"];
        );
        out center;
      `;

      const response = await axios.get(
        'https://overpass-api.de/api/interpreter',
        {
          params: { data: query },
        }
      );

      return response.data.elements || [];
    } catch (err) {
      console.error('Erro ao buscar locais próximos:', err);
      return [];
    }
  },
};

// ===== APPOINTMENT SERVICE =====
export const appointmentService = {
  async getAllAppointments(limit = 10, skip = 0) {
    return await appointmentRepository.findAll(limit, skip);
  },

  async getAppointmentById(id: string) {
    return await appointmentRepository.findById(id);
  },

  async getPatientAppointments(patientId: string, limit = 10, skip = 0) {
    // Validar que o paciente existe
    await patientRepository.findById(patientId);
    return await appointmentRepository.findByPatientId(patientId, limit, skip);
  },

  async getDoctorAppointments(doctorId: string, limit = 10, skip = 0) {
    // Validar que o médico existe
    await userRepository.findById(doctorId);
    return await appointmentRepository.findByDoctorId(doctorId, limit, skip);
  },

  async createAppointment(data: any) {
    validateCreateAppointmentInput(data);

    // Validar que paciente e médico existem
    await patientRepository.findById(data.patientId);
    await userRepository.findById(data.doctorId);

    // Verificar conflitos de agendamento
    const conflicts = await appointmentRepository.findConflicts(
      data.doctorId,
      new Date(data.date)
    );

    if (conflicts.length > 0) {
      throw new ValidationError(
        'O médico já possui uma consulta agendada para este horário'
      );
    }

    return await appointmentRepository.create({
      ...data,
      date: new Date(data.date),
      status: 'CONFIRMED',
    });
  },

  async updateAppointment(id: string, data: any) {
    const appointment = await appointmentRepository.findById(id);

    if (data.date && data.doctorId && data.doctorId === appointment.doctorId) {
      const conflicts = await appointmentRepository.findConflicts(
        data.doctorId,
        new Date(data.date),
        id
      );

      if (conflicts.length > 0) {
        throw new ValidationError(
          'O médico já possui uma consulta agendada para este horário'
        );
      }
    }

    if (data.date) {
      data.date = new Date(data.date);
    }

    return await appointmentRepository.update(id, data);
  },

  async cancelAppointment(id: string, reason: string) {
    return await appointmentRepository.update(id, {
      status: 'CANCELLED',
      notes: reason,
    });
  },

  async getAvailableSlots(doctorId: string, date: string) {
    // Validar médico
    await userRepository.findById(doctorId);

    const appointmentDate = new Date(date);
    const existingAppointments = await appointmentRepository.findConflicts(
      doctorId,
      appointmentDate
    );

    // Definir horários disponíveis (8h às 17h, intervalos de 1h)
    const availableSlots = [];
    for (let hour = 8; hour < 17; hour++) {
      const slotTime = new Date(appointmentDate);
      slotTime.setHours(hour, 0, 0, 0);

      const hasConflict = existingAppointments.some(
        (apt) =>
          apt.date.getHours() === hour &&
          apt.date.getDate() === appointmentDate.getDate()
      );

      if (!hasConflict) {
        availableSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      }
    }

    return availableSlots;
  },
};

// ===== MEDICAL RECORD SERVICE =====
export const medicalRecordService = {
  async getAll(filters?: { patientId?: string; doctorId?: string; appointmentId?: string }) {
    return await medicalRecordRepository.findAll(filters);
  },

  async getById(id: string) {
    return await medicalRecordRepository.findById(id);
  },

  async create(data: any) {
    validateCreateMedicalRecordInput(data);

    // Validar que paciente e médico existem
    await patientRepository.findById(data.patientId);
    await userRepository.findById(data.doctorId);

    // Verificar duplicidade: cada agendamento só pode ter um prontuário
    const existing = await medicalRecordRepository.findByAppointmentId(data.appointmentId);
    if (existing) {
      throw new ConflictError('Já existe um prontuário para este agendamento');
    }

    return await medicalRecordRepository.create(data);
  },

  async update(id: string, data: any) {
    return await medicalRecordRepository.update(id, data);
  },

  async delete(id: string) {
    return await medicalRecordRepository.delete(id);
  },
};

// ===== PRESCRIPTION SERVICE =====
export const prescriptionService = {
  async getByMedicalRecord(medicalRecordId: string) {
    await medicalRecordRepository.findById(medicalRecordId);
    return await prescriptionRepository.findByMedicalRecord(medicalRecordId);
  },

  async getById(id: string) {
    return await prescriptionRepository.findById(id);
  },

  async create(data: any) {
    validateCreatePrescriptionInput(data);
    await medicalRecordRepository.findById(data.medicalRecordId);
    await userRepository.findById(data.doctorId);
    return await prescriptionRepository.create(data);
  },

  async update(id: string, data: any) {
    return await prescriptionRepository.update(id, data);
  },

  async delete(id: string) {
    return await prescriptionRepository.delete(id);
  },
};

// ===== EXAM SERVICE =====
export const examService = {
  async getAll(limit = 10, skip = 0, filters: { patientId?: string; doctorId?: string; status?: string } = {}) {
    return await examRepository.findAll(limit, skip, filters as any);
  },

  async getById(id: string) {
    return await examRepository.findById(id);
  },

  async create(data: any) {
    validateCreateExamInput(data);
    await patientRepository.findById(data.patientId);
    await userRepository.findById(data.doctorId);
    return await examRepository.create({
      ...data,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    });
  },

  async update(id: string, data: any) {
    if (data.scheduledAt) data.scheduledAt = new Date(data.scheduledAt);
    if (data.completedAt) data.completedAt = new Date(data.completedAt);
    return await examRepository.update(id, data);
  },

  async delete(id: string) {
    return await examRepository.delete(id);
  },
};

// ===== SPECIALTY SERVICE =====
export const specialtyService = {
  async getAll(limit = 10, skip = 0) {
    return await specialtyRepository.findAll(limit, skip);
  },

  async getById(id: string) {
    return await specialtyRepository.findById(id);
  },

  async create(data: any) {
    validateCreateSpecialtyInput(data);
    return await specialtyRepository.create(data);
  },

  async update(id: string, data: any) {
    return await specialtyRepository.update(id, data);
  },

  async delete(id: string) {
    return await specialtyRepository.delete(id);
  },
};

// ===== HEALTH PLAN SERVICE =====
export const healthPlanService = {
  async getAll(limit = 10, skip = 0, patientId?: string) {
    return await healthPlanRepository.findAll(limit, skip, patientId);
  },

  async getById(id: string) {
    return await healthPlanRepository.findById(id);
  },

  async create(data: any) {
    validateCreateHealthPlanInput(data);
    await patientRepository.findById(data.patientId);
    return await healthPlanRepository.create({
      ...data,
      validUntil: new Date(data.validUntil),
    });
  },

  async update(id: string, data: any) {
    if (data.validUntil) data.validUntil = new Date(data.validUntil);
    return await healthPlanRepository.update(id, data);
  },

  async delete(id: string) {
    return await healthPlanRepository.delete(id);
  },
};

// ===== VIA CEP SERVICE =====
export const viaCepService = {
  async lookupCEP(cep: string) {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) {
      throw new ValidationError('CEP deve conter 8 dígitos');
    }

    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cleaned}/json/`,
        { timeout: 5000 }
      );

      if (response.data.erro) {
        throw new NotFoundError('CEP');
      }

      const { cep: resCep, logradouro, complemento, bairro, localidade, uf } = response.data;
      return {
        cep: resCep,
        logradouro,
        complemento,
        bairro,
        localidade,
        uf,
        address: `${logradouro}${complemento ? ', ' + complemento : ''}, ${bairro}, ${localidade} - ${uf}`,
      };
    } catch (err: any) {
      if (err.statusCode === 404 || err.code === 'NOT_FOUND') throw err;
      throw new ValidationError('Erro ao consultar CEP. Verifique o número informado.');
    }
  },
};
