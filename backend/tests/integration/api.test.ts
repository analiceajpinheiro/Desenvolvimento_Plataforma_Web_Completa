import express, { Express } from 'express';
import request from 'supertest';
import routes from '../../src/routes';
import {
  authMiddleware,
  errorHandler,
  jsonErrorHandler,
} from '../../src/middlewares';

// Mock dos serviços
jest.mock('../../src/services', () => ({
  authService: {
    register: jest.fn(),
    login: jest.fn(),
    verifyToken: jest.fn(),
    changePassword: jest.fn(),
  },
  userService: {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  },
  patientService: {
    getAllPatients: jest.fn(),
    getPatientById: jest.fn(),
    searchPatients: jest.fn(),
    createPatient: jest.fn(),
    updatePatient: jest.fn(),
    deletePatient: jest.fn(),
    getNearbyClinic: jest.fn(),
  },
  appointmentService: {
    getAllAppointments: jest.fn(),
    getAppointmentById: jest.fn(),
    getPatientAppointments: jest.fn(),
    getDoctorAppointments: jest.fn(),
    createAppointment: jest.fn(),
    updateAppointment: jest.fn(),
    cancelAppointment: jest.fn(),
    getAvailableSlots: jest.fn(),
  },
}));

describe('API Integration Tests', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(jsonErrorHandler);
    app.use('/api', routes);
    app.use(errorHandler);
    jest.clearAllMocks();
  });

  describe('Auth Routes', () => {
    it('POST /api/auth/register deve registrar novo usuário', async () => {
      const { authService } = require('../../src/services');
      const mockUser = {
        id: 'user-1',
        name: 'Dr. João',
        email: 'dr.joao@example.com',
        role: 'DOCTOR',
        specialty: 'Cardiologia',
      };

      authService.register.mockResolvedValue({
        user: mockUser,
        token: 'jwt-token-123',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Dr. João',
          email: 'dr.joao@example.com',
          password: 'Senha123',
          role: 'DOCTOR',
          specialty: 'Cardiologia',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(authService.register).toHaveBeenCalled();
    });

    it('POST /api/auth/login deve fazer login com sucesso', async () => {
      const { authService } = require('../../src/services');
      const mockUser = {
        id: 'user-1',
        name: 'Dr. João',
        email: 'dr.joao@example.com',
        role: 'DOCTOR',
        specialty: 'Cardiologia',
      };

      authService.login.mockResolvedValue({
        user: mockUser,
        token: 'jwt-token-123',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'dr.joao@example.com',
          password: 'Senha123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(authService.login).toHaveBeenCalledWith(
        'dr.joao@example.com',
        'Senha123'
      );
    });

    it('POST /api/auth/login deve rejeitar credenciais ausentes', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Patient Routes', () => {
    it('GET /api/patients deve retornar lista de pacientes (com autenticação)', async () => {
      const { authService, patientService } = require('../../src/services');

      authService.verifyToken.mockReturnValue('user-1');
      patientService.getAllPatients.mockResolvedValue({
        data: [
          {
            id: 'patient-1',
            name: 'João Silva',
            cpf: '11144477735',
            email: 'joao@example.com',
          },
        ],
        total: 1,
      });

      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(patientService.getAllPatients).toHaveBeenCalled();
    });

    it('GET /api/patients deve rejeitar sem token', async () => {
      const response = await request(app).get('/api/patients');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('GET /api/patients/search deve buscar pacientes', async () => {
      const { authService, patientService } = require('../../src/services');

      authService.verifyToken.mockReturnValue('user-1');
      patientService.searchPatients.mockResolvedValue([
        {
          id: 'patient-1',
          name: 'João Silva',
          cpf: '11144477735',
        },
      ]);

      const response = await request(app)
        .get('/api/patients/search?q=João')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(patientService.searchPatients).toHaveBeenCalledWith('João', 10);
    });

    it('POST /api/patients deve criar novo paciente', async () => {
      const { authService, patientService, userService } = require('../../src/services');

      authService.verifyToken.mockReturnValue('user-1');
      userService.getUserById.mockResolvedValue({
        id: 'user-1',
        role: 'DOCTOR',
      });
      patientService.createPatient.mockResolvedValue({
        id: 'patient-1',
        name: 'João Silva',
        cpf: '11144477735',
        email: 'joao@example.com',
      });

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', 'Bearer valid-token')
        .send({
          name: 'João Silva',
          cpf: '11144477735',
          birthDate: '1990-05-15',
          gender: 'M',
          phone: '11987654321',
          email: 'joao@example.com',
          address: 'Rua A, 123',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(patientService.createPatient).toHaveBeenCalled();
    });
  });

  describe('Appointment Routes', () => {
    it('GET /api/appointments deve retornar lista de agendamentos', async () => {
      const { authService, appointmentService } = require('../../src/services');

      authService.verifyToken.mockReturnValue('user-1');
      appointmentService.getAllAppointments.mockResolvedValue({
        data: [
          {
            id: 'apt-1',
            date: '2024-12-25T14:00:00Z',
            status: 'CONFIRMED',
            doctorId: 'doctor-1',
            patientId: 'patient-1',
          },
        ],
        total: 1,
      });

      const response = await request(app)
        .get('/api/appointments')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(appointmentService.getAllAppointments).toHaveBeenCalled();
    });

    it('GET /api/doctors/:doctorId/available-slots deve retornar horários disponíveis', async () => {
      const { authService, appointmentService } = require('../../src/services');

      authService.verifyToken.mockReturnValue('user-1');
      appointmentService.getAvailableSlots.mockResolvedValue([
        '08:00',
        '09:00',
        '10:00',
      ]);

      const response = await request(app)
        .get('/api/doctors/doctor-1/available-slots?date=2024-12-25')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(appointmentService.getAvailableSlots).toHaveBeenCalledWith(
        'doctor-1',
        '2024-12-25'
      );
    });

    it('POST /api/appointments deve criar novo agendamento', async () => {
      const { authService, appointmentService, userService } = require('../../src/services');

      authService.verifyToken.mockReturnValue('user-1');
      userService.getUserById.mockResolvedValue({
        id: 'user-1',
        role: 'RECEPTIONIST',
      });
      appointmentService.createAppointment.mockResolvedValue({
        id: 'apt-1',
        date: '2024-12-25T14:00:00Z',
        status: 'CONFIRMED',
        doctorId: 'doctor-1',
        patientId: 'patient-1',
      });

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', 'Bearer valid-token')
        .send({
          doctorId: 'doctor-1',
          patientId: 'patient-1',
          date: '2024-12-25T14:00:00Z',
          notes: 'Consulta de rotina',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(appointmentService.createAppointment).toHaveBeenCalled();
    });

    it('PATCH /api/appointments/:id/cancel deve cancelar agendamento', async () => {
      const { authService, appointmentService, userService } = require('../../src/services');

      authService.verifyToken.mockReturnValue('user-1');
      userService.getUserById.mockResolvedValue({
        id: 'user-1',
        role: 'RECEPTIONIST',
      });
      appointmentService.cancelAppointment.mockResolvedValue({
        id: 'apt-1',
        date: '2024-12-25T14:00:00Z',
        status: 'CANCELLED',
        doctorId: 'doctor-1',
        patientId: 'patient-1',
      });

      const response = await request(app)
        .patch('/api/appointments/apt-1/cancel')
        .set('Authorization', 'Bearer valid-token')
        .send({
          reason: 'Paciente solicitou cancelamento',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(appointmentService.cancelAppointment).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('deve retornar 404 para rota não encontrada', async () => {
      const response = await request(app).get('/api/inexistent-route');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar 400 para JSON inválido', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_JSON');
    });
  });
});
