// Exemplo de estrutura para rotas
// Este é um template para orientar a estrutura de rotas

import { Router } from 'express';

/**
 * Cada rota deve:
 * 1. Ter um nome descritivo
 * 2. Usar métodos HTTP corretos (GET, POST, PUT, DELETE)
 * 3. Chamar o controller apropriado
 * 4. Ter validação de entrada (se necessário)
 * 5. Ter middleware de autenticação (se necessário)
 */

const router = Router();

// Exemplo de rotas para Autenticação
// router.post('/auth/login', AuthController.login);
// router.post('/auth/logout', AuthController.logout);
// router.post('/auth/refresh', AuthController.refreshToken);

// Exemplo de rotas para Pacientes (CRUD)
// router.get('/patients', authenticate, PatientsController.getAll);
// router.get('/patients/:id', authenticate, PatientsController.getById);
// router.post('/patients', authenticate, PatientsController.create);
// router.put('/patients/:id', authenticate, PatientsController.update);
// router.delete('/patients/:id', authenticate, PatientsController.delete);

// Exemplo de rotas para Agendamentos
// router.get('/appointments', authenticate, AppointmentsController.getAll);
// router.post('/appointments', authenticate, AppointmentsController.create);
// router.put('/appointments/:id', authenticate, AppointmentsController.update);
// router.delete('/appointments/:id', authenticate, AppointmentsController.cancel);

// Exemplo de rotas para Prontuários
// router.get('/medical-records/:patientId', authenticate, MedicalRecordsController.getByPatient);
// router.post('/medical-records', authenticate, MedicalRecordsController.create);
// router.put('/medical-records/:id', authenticate, MedicalRecordsController.update);

export default router;
