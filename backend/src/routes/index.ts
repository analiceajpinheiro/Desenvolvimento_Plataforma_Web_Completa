import { Router } from 'express';
import {
  authController,
  userController,
  patientController,
  appointmentController,
  examController,
  specialtyController,
  healthPlanController,
  viaCepController,
} from '../controllers';
import { medicalRecordController } from '../controllers';
import { prescriptionController } from '../controllers';
import { authMiddleware, roleMiddleware } from '../middlewares';

const router = Router();

// ===== AUTH ROUTES =====
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/change-password', authMiddleware, authController.changePassword);

// ===== USER ROUTES =====
router.get('/users', authMiddleware, userController.getAll);
router.get('/users/:id', authMiddleware, userController.getById);
router.put('/users/:id', authMiddleware, roleMiddleware(['ADMIN']), userController.update);
router.delete('/users/:id', authMiddleware, roleMiddleware(['ADMIN']), userController.delete);

// ===== PATIENT ROUTES =====
router.get('/patients', authMiddleware, patientController.getAll);
router.get('/patients/search', authMiddleware, patientController.search);
router.post('/patients', authMiddleware, roleMiddleware(['DOCTOR', 'RECEPTIONIST', 'ADMIN']), patientController.create);
router.get('/patients/:id', authMiddleware, patientController.getById);
router.put('/patients/:id', authMiddleware, roleMiddleware(['DOCTOR', 'RECEPTIONIST', 'ADMIN']), patientController.update);
router.delete('/patients/:id', authMiddleware, roleMiddleware(['DOCTOR', 'RECEPTIONIST', 'ADMIN']), patientController.delete);
router.get('/patients/:id/nearby-clinics', authMiddleware, patientController.getNearbyClinic);

// ===== APPOINTMENT ROUTES =====
router.get('/appointments', authMiddleware, appointmentController.getAll);
router.post('/appointments', authMiddleware, roleMiddleware(['DOCTOR', 'RECEPTIONIST', 'ADMIN']), appointmentController.create);
router.get('/appointments/:id', authMiddleware, appointmentController.getById);
router.put('/appointments/:id', authMiddleware, roleMiddleware(['DOCTOR', 'RECEPTIONIST', 'ADMIN']), appointmentController.update);
router.patch('/appointments/:id/cancel', authMiddleware, roleMiddleware(['DOCTOR', 'RECEPTIONIST', 'ADMIN']), appointmentController.cancel);
router.get('/patients/:patientId/appointments', authMiddleware, appointmentController.getPatientAppointments);
router.get('/doctors/:doctorId/appointments', authMiddleware, appointmentController.getDoctorAppointments);
router.get('/doctors/:doctorId/available-slots', authMiddleware, appointmentController.getAvailableSlots);

// ===== MEDICAL RECORD ROUTES =====
router.get('/medical-records', authMiddleware, medicalRecordController.getAll);
router.get('/medical-records/:id', authMiddleware, medicalRecordController.getById);
router.post('/medical-records', authMiddleware, roleMiddleware(['DOCTOR', 'ADMIN']), medicalRecordController.create);
router.put('/medical-records/:id', authMiddleware, roleMiddleware(['DOCTOR', 'ADMIN']), medicalRecordController.update);
router.delete('/medical-records/:id', authMiddleware, roleMiddleware(['ADMIN']), medicalRecordController.delete);
router.get('/patients/:id/medical-records', authMiddleware, (req, res, next) => {
  req.query.patientId = req.params.id;
  return medicalRecordController.getAll(req, res, next);
});

// ===== PRESCRIPTION ROUTES =====
router.get('/medical-records/:id/prescriptions', authMiddleware, prescriptionController.getByMedicalRecord);
router.post('/medical-records/:id/prescriptions', authMiddleware, roleMiddleware(['DOCTOR', 'ADMIN']), prescriptionController.create);
router.get('/prescriptions/:id', authMiddleware, prescriptionController.getById);
router.put('/prescriptions/:id', authMiddleware, roleMiddleware(['DOCTOR', 'ADMIN']), prescriptionController.update);
router.delete('/prescriptions/:id', authMiddleware, roleMiddleware(['DOCTOR', 'ADMIN']), prescriptionController.delete);

// ===== EXAM ROUTES (Sprint 3) =====
router.get('/exams', authMiddleware, examController.getAll);
router.post('/exams', authMiddleware, roleMiddleware(['DOCTOR', 'ADMIN']), examController.create);
router.get('/exams/:id', authMiddleware, examController.getById);
router.put('/exams/:id', authMiddleware, roleMiddleware(['DOCTOR', 'ADMIN']), examController.update);
router.delete('/exams/:id', authMiddleware, roleMiddleware(['DOCTOR', 'ADMIN']), examController.delete);

// ===== SPECIALTY ROUTES (Sprint 3) =====
router.get('/specialties', authMiddleware, specialtyController.getAll);
router.post('/specialties', authMiddleware, roleMiddleware(['ADMIN']), specialtyController.create);
router.get('/specialties/:id', authMiddleware, specialtyController.getById);
router.put('/specialties/:id', authMiddleware, roleMiddleware(['ADMIN']), specialtyController.update);
router.delete('/specialties/:id', authMiddleware, roleMiddleware(['ADMIN']), specialtyController.delete);

// ===== HEALTH PLAN ROUTES (Sprint 3) =====
router.get('/health-plans', authMiddleware, healthPlanController.getAll);
router.post('/health-plans', authMiddleware, roleMiddleware(['DOCTOR', 'RECEPTIONIST', 'ADMIN']), healthPlanController.create);
router.get('/health-plans/:id', authMiddleware, healthPlanController.getById);
router.put('/health-plans/:id', authMiddleware, roleMiddleware(['DOCTOR', 'RECEPTIONIST', 'ADMIN']), healthPlanController.update);
router.delete('/health-plans/:id', authMiddleware, roleMiddleware(['ADMIN']), healthPlanController.delete);
router.get('/patients/:patientId/health-plans', authMiddleware, (req, res, next) => {
  req.query.patientId = req.params.patientId;
  return healthPlanController.getAll(req, res, next);
});

// ===== VIA CEP ROUTE (Sprint 3) =====
router.get('/address/cep/:cep', authMiddleware, viaCepController.lookup);

export default router;
