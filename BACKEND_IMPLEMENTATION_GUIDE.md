# 🔨 Instruções Para Backend — VitaLink

**Desenvolvido por:** Senior Developer  
**Frontend Status:** ✅ Completo  
**Backend Status:** ⏳ A Implementar

---

## 🎯 Objetivo Backend

Implementar a lógica de negócio, persistência de dados e integração com API externa, para que o Frontend funcione corretamente.

## 📋 Pré-requisitos

- Node.js >= 18.x
- PostgreSQL >= 15.x
- npm >= 9.x
- Postman/Insomnia (para testar APIs)

---

## 🚀 Fases de Implementação

### FASE 1: Setup e Autenticação (Crítico) ⚡

**Arquivos a criar:**
```
backend/src/
├── middlewares/
│   ├── auth.ts          # JWT verification
│   ├── validation.ts    # Input validation
│   └── errorHandler.ts  # Error handling
├── routes/
│   ├── auth.ts          # Login, logout, refresh
│   └── index.ts         # Route aggregator
└── controllers/
    └── authController.ts # Auth logic
```

**Endpoints a implementar:**
```javascript
POST   /api/auth/login       // Login
POST   /api/auth/logout      // Logout
POST   /api/auth/refresh     // Refresh token
GET    /api/auth/me          // Current user
```

**Tasks:**
1. [ ] Setup PostgreSQL + Prisma
2. [ ] Create migrations (users table)
3. [ ] Implement JWT auth
4. [ ] Create auth middleware
5. [ ] Setup error handling middleware
6. [ ] Write unit tests for auth
7. [ ] Test endpoints with Postman

---

### FASE 2: Pacientes API (Core) 🏥

**Arquivos a criar:**
```
backend/src/
├── controllers/
│   └── patientController.ts
├── services/
│   └── patientService.ts
├── repositories/
│   └── patientRepository.ts
└── routes/
    └── patients.ts
```

**Endpoints a implementar:**
```javascript
GET    /api/patients?page=1&limit=10    // List
GET    /api/patients/:id                 // Get one
GET    /api/patients/search?query=...    // Search
POST   /api/patients                     // Create
PUT    /api/patients/:id                 // Update
DELETE /api/patients/:id                 // Soft delete
GET    /api/patients/:id/nearby-clinics  // Geo location
```

**Implementação (Estrutura Padrão):**

**patientRepository.ts:**
```typescript
import { PrismaClient, Patient } from '@prisma/client';

const prisma = new PrismaClient();

export const patientRepository = {
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.patient.findMany({ skip, take: limit }),
      prisma.patient.count(),
    ]);
    return { data, total, page, limit };
  },

  async findById(id: string) {
    return prisma.patient.findUnique({ where: { id } });
  },

  async search(query: string) {
    return prisma.patient.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { cpf: { contains: query } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  },

  async create(data: CreatePatientDTO) {
    return prisma.patient.create({ data });
  },

  async update(id: string, data: UpdatePatientDTO) {
    return prisma.patient.update({ where: { id }, data });
  },

  async delete(id: string) {
    // Soft delete - adicione campo 'deletedAt' ao schema
    return prisma.patient.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
```

**patientService.ts:**
```typescript
import { patientRepository } from '../repositories/patientRepository';
import { validateCPF, validateEmail } from '../utils/validators';

export const patientService = {
  async listPatients(page: number, limit: number) {
    return patientRepository.findAll(page, limit);
  },

  async searchPatients(query: string) {
    if (!query || query.trim().length < 2) {
      throw new Error('Query deve ter pelo menos 2 caracteres');
    }
    return patientRepository.search(query);
  },

  async createPatient(data: CreatePatientDTO) {
    // Validações
    if (!validateCPF(data.cpf)) {
      throw new Error('CPF inválido');
    }

    if (!validateEmail(data.email)) {
      throw new Error('Email inválido');
    }

    // Verificar duplicatas
    const existing = await patientRepository.search(data.cpf);
    if (existing.length > 0) {
      throw new Error('CPF já cadastrado');
    }

    // Geolocalização (Nominatim)
    const coords = await getCoordinates(data.address);

    return patientRepository.create({
      ...data,
      latitude: coords?.lat,
      longitude: coords?.lon,
    });
  },

  async updatePatient(id: string, data: UpdatePatientDTO) {
    const patient = await patientRepository.findById(id);
    if (!patient) throw new Error('Paciente não encontrado');

    if (data.cpf && data.cpf !== patient.cpf) {
      if (!validateCPF(data.cpf)) {
        throw new Error('CPF inválido');
      }
    }

    return patientRepository.update(id, data);
  },

  async deletePatient(id: string) {
    const patient = await patientRepository.findById(id);
    if (!patient) throw new Error('Paciente não encontrado');

    return patientRepository.delete(id);
  },
};

// Helper para geolocalização via Nominatim
async function getCoordinates(address: string) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
  } catch (error) {
    console.error('Erro ao geocodificar:', error);
  }
  return null;
}
```

**patientController.ts:**
```typescript
import { Request, Response } from 'express';
import { patientService } from '../services/patientService';

export const patientController = {
  async list(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await patientService.listPatients(
        Number(page),
        Number(limit)
      );
      return res.json({ data: result.data, total: result.total, page, limit });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async search(req: Request, res: Response) {
    try {
      const { query } = req.query;
      const results = await patientService.searchPatients(query as string);
      return res.json({ data: results });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const patient = await patientRepository.findById(id);
      if (!patient) return res.status(404).json({ error: 'Não encontrado' });
      return res.json({ data: patient });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const patient = await patientService.createPatient(req.body);
      return res.status(201).json({ data: patient });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const patient = await patientService.updatePatient(id, req.body);
      return res.json({ data: patient });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await patientService.deletePatient(id);
      return res.json({ message: 'Paciente deletado' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};
```

**patients.ts (Route):**
```typescript
import { Router } from 'express';
import { patientController } from '../controllers/patientController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware); // Proteger todas as rotas

router.get('/', patientController.list);
router.get('/search', patientController.search);
router.get('/:id', patientController.getById);
router.post('/', patientController.create);
router.put('/:id', patientController.update);
router.delete('/:id', patientController.delete);

export default router;
```

**Tasks:**
1. [ ] Criar controllers
2. [ ] Criar services
3. [ ] Criar repositories
4. [ ] Criar rotas
5. [ ] Integrar Nominatim
6. [ ] Testes unitários
7. [ ] Testes de integração

---

### FASE 3: Agendamentos API (Core) 📅

**Endpoints a implementar:**
```javascript
GET    /api/appointments?page=1&limit=10
GET    /api/appointments/:id
GET    /api/patients/:id/appointments
GET    /api/doctors/:id/appointments?date=...
POST   /api/appointments
PUT    /api/appointments/:id
PATCH  /api/appointments/:id/cancel
GET    /api/doctors/:id/available-slots?date=...
GET    /api/doctors/:id/availability?date=...
```

**Validações Importantes:**
- Verificar disponibilidade do médico
- Validar data/hora (não passada)
- Validar conflitos de agendamento
- Registrar histórico de cancelamentos

---

### FASE 4: Testes Backend 🧪

**Testes Unitários:**
```
✅ Repository tests (mock Prisma)
✅ Service tests (validações)
✅ Controller tests (HTTP layer)
```

**Testes de Integração:**
```
✅ API endpoint tests (Supertest)
✅ Database integration
✅ Error handling
```

**Exemplo com Jest + Supertest:**
```typescript
import request from 'supertest';
import app from '../src/index';

describe('Pacientes API', () => {
  describe('GET /api/patients', () => {
    it('Deve retornar lista de pacientes', async () => {
      const res = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it('Deve validar autenticação', async () => {
      const res = await request(app)
        .get('/api/patients');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/patients', () => {
    it('Deve criar paciente com dados válidos', async () => {
      const newPatient = {
        name: 'João Silva',
        cpf: '12345678901',
        birthDate: '1990-01-15',
        gender: 'M',
        phone: '11999999999',
        email: 'joao@example.com',
        address: 'Rua A, 123',
      };

      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(newPatient);

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
    });

    it('Deve rejeitar CPF inválido', async () => {
      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...data, cpf: '00000000000' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('CPF');
    });
  });
});
```

---

## 🗂️ Estrutura Final Esperada

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── patientController.ts
│   │   ├── appointmentController.ts
│   │   ├── medicalRecordController.ts
│   │   └── prescriptionController.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── patientService.ts
│   │   ├── appointmentService.ts
│   │   ├── medicalRecordService.ts
│   │   └── prescriptionService.ts
│   ├── repositories/
│   │   ├── patientRepository.ts
│   │   ├── appointmentRepository.ts
│   │   ├── medicalRecordRepository.ts
│   │   └── prescriptionRepository.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── patients.ts
│   │   ├── appointments.ts
│   │   ├── medicalRecords.ts
│   │   ├── prescriptions.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── errors.ts
│   │   └── helpers.ts
│   ├── types/
│   │   ├── index.ts (DTOs)
│   │   └── request.d.ts (extended Express)
│   └── index.ts (servidor)
├── tests/
│   ├── unit/
│   │   ├── validators.test.ts
│   │   ├── services.test.ts
│   │   └── repositories.test.ts
│   ├── integration/
│   │   ├── auth.test.ts
│   │   ├── patients.test.ts
│   │   ├── appointments.test.ts
│   │   └── setup.ts
│   └── fixtures/
│       └── data.ts
├── prisma/
│   ├── schema.prisma (ATUALIZAR)
│   └── migrations/
├── .env.example
├── jest.config.js
├── tsconfig.json
└── package.json
```

---

## ✅ Checklist de Implementação

### Autenticação
- [ ] JWT setup
- [ ] Password hashing (bcrypt)
- [ ] Auth middleware
- [ ] Login endpoint
- [ ] Refresh token
- [ ] Logout

### Pacientes
- [ ] CRUD completo
- [ ] Validações
- [ ] Geocodificação
- [ ] Paginação
- [ ] Busca
- [ ] Soft delete
- [ ] Tests

### Agendamentos
- [ ] CRUD completo
- [ ] Validação de disponibilidade
- [ ] Cancelamento
- [ ] Slots management
- [ ] Tests

### Outros
- [ ] Error handling
- [ ] Logging
- [ ] Documentação OpenAPI
- [ ] CI/CD setup
- [ ] Deploy

---

## 🔗 APIs Externas

### Nominatim (OpenStreetMap)

**Endpoint:** `https://nominatim.openstreetmap.org/search`

**Exemplo:**
```bash
curl "https://nominatim.openstreetmap.org/search?format=json&q=Avenida+Paulista+1000+Sao+Paulo+Brazil"
```

**Response:**
```json
[
  {
    "lat": "-23.5616",
    "lon": "-46.6561",
    "display_name": "Avenida Paulista, 1000, São Paulo"
  }
]
```

---

## 📞 Contato Frontend

O Frontend está **100% pronto** para receber as APIs.

**API Client:**
- ✅ `patientService.ts` — Todos os endpoints
- ✅ `appointmentService.ts` — Todos os endpoints
- ✅ JWT interceptador
- ✅ Error handling
- ✅ Retry logic

**Basta implementar os endpoints conforme documentado!**

---

## 🚀 Quick Start Backend

```bash
# 1. Setup
cd backend
npm install

# 2. Database
cp .env.example .env
# Editar .env com PostgreSQL
npx prisma migrate dev --name init

# 3. Development
npm run dev

# 4. Tests
npm run test
npm run test:coverage

# 5. Verificar
curl http://localhost:3333/health
```

---

**Boa sorte na implementação! 🚀**

O Frontend está esperando por você! ⏳

