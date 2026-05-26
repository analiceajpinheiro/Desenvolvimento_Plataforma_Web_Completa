import { Request, Response, NextFunction } from 'express';
import {
  authService,
  userService,
  patientService,
  appointmentService,
  examService,
  specialtyService,
  healthPlanService,
  viaCepService,
} from '../services';
import { medicalRecordService } from '../services';
import { prescriptionService } from '../services';
import { ValidationError, AppError } from '../utils/errors';

// ===== AUTH CONTROLLER =====
export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await authService.register(req.body);
      return res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: { user, token },
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError('Email e senha são obrigatórios');
      }

      const { user, token } = await authService.login(email, password);
      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: { user, token },
      });
    } catch (err) {
      next(err);
    }
  },

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new ValidationError('Senha atual e nova senha são obrigatórias');
      }

      const user = await authService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      return res.status(200).json({
        success: true,
        message: 'Senha alterada com sucesso',
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  },
};

// ===== USER CONTROLLER =====
export const userController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const role = (req.query.role as string) || undefined;

      const skip = (page - 1) * limit;
      const result = await userService.getAllUsers(limit, skip, role);

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserById(req.params.id);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deleteUser(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Usuário desativado com sucesso',
      });
    } catch (err) {
      next(err);
    }
  },
};

// ===== PATIENT CONTROLLER =====
export const patientController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;

      const skip = (page - 1) * limit;
      const result = await patientService.getAllPatients(limit, skip);

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 10;

      const results = await patientService.searchPatients(query, limit);
      return res.status(200).json({
        success: true,
        data: results,
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await patientService.getPatientById(req.params.id);
      return res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await patientService.createPatient(req.body);
      return res.status(201).json({
        success: true,
        message: 'Paciente criado com sucesso',
        data: patient,
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await patientService.updatePatient(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Paciente atualizado com sucesso',
        data: patient,
      });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await patientService.deletePatient(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Paciente removido com sucesso',
      });
    } catch (err) {
      next(err);
    }
  },

  async getNearbyClinic(req: Request, res: Response, next: NextFunction) {
    try {
      const clinics = await patientService.getNearbyClinic(req.params.id);
      return res.status(200).json({
        success: true,
        data: clinics,
      });
    } catch (err) {
      next(err);
    }
  },
};

// ===== APPOINTMENT CONTROLLER =====
export const appointmentController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;

      const skip = (page - 1) * limit;
      const result = await appointmentService.getAllAppointments(limit, skip);

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.getAppointmentById(req.params.id);
      return res.status(200).json({
        success: true,
        data: appointment,
      });
    } catch (err) {
      next(err);
    }
  },

  async getPatientAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;

      const skip = (page - 1) * limit;
      const result = await appointmentService.getPatientAppointments(
        req.params.patientId,
        limit,
        skip
      );

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getDoctorAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;

      const skip = (page - 1) * limit;
      const result = await appointmentService.getDoctorAppointments(
        req.params.doctorId,
        limit,
        skip
      );

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      return res.status(201).json({
        success: true,
        message: 'Agendamento criado com sucesso',
        data: appointment,
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.updateAppointment(
        req.params.id,
        req.body
      );
      return res.status(200).json({
        success: true,
        message: 'Agendamento atualizado com sucesso',
        data: appointment,
      });
    } catch (err) {
      next(err);
    }
  },

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { reason } = req.body;
      const appointment = await appointmentService.cancelAppointment(
        req.params.id,
        reason || ''
      );
      return res.status(200).json({
        success: true,
        message: 'Agendamento cancelado com sucesso',
        data: appointment,
      });
    } catch (err) {
      next(err);
    }
  },

  async getAvailableSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctorId } = req.params;
      const { date } = req.query;

      if (!doctorId || !date) {
        throw new ValidationError('doctorId e date são obrigatórios');
      }

      const slots = await appointmentService.getAvailableSlots(
        doctorId as string,
        date as string
      );

      return res.status(200).json({
        success: true,
        data: slots,
      });
    } catch (err) {
      next(err);
    }
  },
};

// ===== MEDICAL RECORD CONTROLLER =====
export const medicalRecordController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId, doctorId } = req.query;
      const records = await medicalRecordService.getAll({
        ...(patientId && { patientId: patientId as string }),
        ...(doctorId && { doctorId: doctorId as string }),
      });
      return res.status(200).json({
        success: true,
        data: records,
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await medicalRecordService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: record,
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await medicalRecordService.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Prontuário criado com sucesso',
        data: record,
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await medicalRecordService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Prontuário atualizado com sucesso',
        data: record,
      });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await medicalRecordService.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Prontuário removido com sucesso',
      });
    } catch (err) {
      next(err);
    }
  },
};

// ===== EXAM CONTROLLER =====
export const examController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const skip = (page - 1) * limit;
      const { patientId, doctorId, status } = req.query;

      const result = await examService.getAll(limit, skip, {
        ...(patientId && { patientId: patientId as string }),
        ...(doctorId && { doctorId: doctorId as string }),
        ...(status && { status: status as string }),
      });

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await examService.getById(req.params.id);
      return res.status(200).json({ success: true, data: exam });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await examService.create(req.body);
      return res.status(201).json({ success: true, message: 'Exame criado com sucesso', data: exam });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await examService.update(req.params.id, req.body);
      return res.status(200).json({ success: true, message: 'Exame atualizado com sucesso', data: exam });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await examService.delete(req.params.id);
      return res.status(200).json({ success: true, message: 'Exame removido com sucesso' });
    } catch (err) {
      next(err);
    }
  },
};

// ===== SPECIALTY CONTROLLER =====
export const specialtyController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const page = parseInt(req.query.page as string) || 1;
      const skip = (page - 1) * limit;

      const result = await specialtyService.getAll(limit, skip);
      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const specialty = await specialtyService.getById(req.params.id);
      return res.status(200).json({ success: true, data: specialty });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const specialty = await specialtyService.create(req.body);
      return res.status(201).json({ success: true, message: 'Especialidade criada com sucesso', data: specialty });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const specialty = await specialtyService.update(req.params.id, req.body);
      return res.status(200).json({ success: true, message: 'Especialidade atualizada com sucesso', data: specialty });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await specialtyService.delete(req.params.id);
      return res.status(200).json({ success: true, message: 'Especialidade desativada com sucesso' });
    } catch (err) {
      next(err);
    }
  },
};

// ===== HEALTH PLAN CONTROLLER =====
export const healthPlanController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const skip = (page - 1) * limit;
      const patientId = req.query.patientId as string | undefined;

      const result = await healthPlanService.getAll(limit, skip, patientId);
      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await healthPlanService.getById(req.params.id);
      return res.status(200).json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await healthPlanService.create(req.body);
      return res.status(201).json({ success: true, message: 'Convênio criado com sucesso', data: plan });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await healthPlanService.update(req.params.id, req.body);
      return res.status(200).json({ success: true, message: 'Convênio atualizado com sucesso', data: plan });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await healthPlanService.delete(req.params.id);
      return res.status(200).json({ success: true, message: 'Convênio removido com sucesso' });
    } catch (err) {
      next(err);
    }
  },
};

// ===== VIA CEP CONTROLLER =====
export const viaCepController = {
  async lookup(req: Request, res: Response, next: NextFunction) {
    try {
      const { cep } = req.params;
      const addressData = await viaCepService.lookupCEP(cep);
      return res.status(200).json({ success: true, data: addressData });
    } catch (err) {
      next(err);
    }
  },
};

// ===== PRESCRIPTION CONTROLLER =====
export const prescriptionController = {
  async getByMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const prescriptions = await prescriptionService.getByMedicalRecord(req.params.id);
      return res.status(200).json({
        success: true,
        data: prescriptions,
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const prescription = await prescriptionService.getById(req.params.id);
      return res.status(200).json({
        success: true,
        data: prescription,
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const prescription = await prescriptionService.create({
        ...req.body,
        medicalRecordId: req.params.id,
      });
      return res.status(201).json({
        success: true,
        message: 'Prescrição criada com sucesso',
        data: prescription,
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const prescription = await prescriptionService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Prescrição atualizada com sucesso',
        data: prescription,
      });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prescriptionService.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Prescrição removida com sucesso',
      });
    } catch (err) {
      next(err);
    }
  },
};
