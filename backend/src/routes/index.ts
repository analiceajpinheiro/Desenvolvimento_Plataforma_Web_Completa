import { Router } from 'express';
import {
  authController,
  userController,
  patientController,
  appointmentController,
} from '../controllers';
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

export default router;
