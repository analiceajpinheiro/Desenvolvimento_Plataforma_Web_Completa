# Sprint 3 — VitaLink Platform

## Visão Geral

O Sprint 3 expandiu a plataforma VitaLink com 3 novos módulos CRUD completos, integração com a API ViaCEP para preenchimento automático de endereços, testes completos para todas as novas funcionalidades, pipeline CI/CD com GitHub Actions e documentação atualizada.

---

## Funcionalidades Implementadas

### 1. Módulo de Exames (`/exams`)

**Backend:**
- `GET /api/exams` — Listar exames com paginação e filtros (`patientId`, `doctorId`, `status`)
- `POST /api/exams` — Criar novo exame (requer DOCTOR ou ADMIN)
- `GET /api/exams/:id` — Buscar exame por ID
- `PUT /api/exams/:id` — Atualizar exame, incluindo resultado e status
- `DELETE /api/exams/:id` — Remover exame

**Modelo de Dados:**
```
Exam {
  id, name, type (LAB/IMAGE/FUNCTIONAL/OTHER),
  description, result, status (REQUESTED/SCHEDULED/IN_PROGRESS/COMPLETED/CANCELLED),
  scheduledAt, completedAt, patientId, doctorId,
  createdAt, updatedAt
}
```

**Frontend:**
- `ExamsList.tsx` — Lista de exames com status colorido, paginação, editar/deletar
- `ExamsForm.tsx` — Formulário de criação e edição de exames

---

### 2. Módulo de Especialidades (`/specialties`)

**Backend:**
- `GET /api/specialties` — Listar especialidades com paginação
- `POST /api/specialties` — Criar especialidade (requer ADMIN)
- `GET /api/specialties/:id` — Buscar por ID
- `PUT /api/specialties/:id` — Atualizar especialidade
- `DELETE /api/specialties/:id` — Desativar especialidade (soft delete)

**Modelo de Dados:**
```
Specialty {
  id, name (único), description, isActive,
  createdAt, updatedAt
}
```

**Frontend:**
- `SpecialtiesList.tsx` — Lista de especialidades com indicador de status (ativo/inativo)
- `SpecialtiesForm.tsx` — Formulário de criação e edição

---

### 3. Módulo de Convênios (`/health-plans`)

**Backend:**
- `GET /api/health-plans` — Listar convênios com filtro por paciente
- `POST /api/health-plans` — Criar convênio (requer DOCTOR, RECEPTIONIST ou ADMIN)
- `GET /api/health-plans/:id` — Buscar por ID
- `PUT /api/health-plans/:id` — Atualizar convênio
- `DELETE /api/health-plans/:id` — Remover convênio (requer ADMIN)
- `GET /api/patients/:patientId/health-plans` — Convênios de um paciente específico

**Modelo de Dados:**
```
HealthPlan {
  id, planName, provider, planNumber (único),
  validUntil, notes, isActive, patientId,
  createdAt, updatedAt
}
```

**Frontend:**
- `HealthPlansList.tsx` — Lista de convênios com data de validade, operadora, status
- `HealthPlansForm.tsx` — Formulário de criação e edição

---

### 4. Integração ViaCEP

**Backend:**
- `GET /api/address/cep/:cep` — Consulta CEP via API pública ViaCEP
- Retorna: `cep`, `logradouro`, `complemento`, `bairro`, `localidade`, `uf`, `address` (formatado)
- Validação: CEP deve ter exatamente 8 dígitos
- Tratamento de erros: CEP inválido, CEP não encontrado, falha de conexão

**Frontend (PatientsForm):**
- Campo CEP adicionado ao formulário de pacientes
- Auto-preenchimento: ao digitar 8 dígitos, consulta automaticamente o ViaCEP
- Botão "Buscar" para consulta manual
- Preenche automaticamente o campo "Endereço Completo"
- Mensagens de erro claras para CEP inválido ou não encontrado

---

## Testes

### Backend

**Testes de Integração** (`tests/integration/api.test.ts`):
- Todos os endpoints dos 3 novos módulos testados
- Endpoint ViaCEP testado
- Verificação de autenticação e autorização por role

**Testes Unitários** (`tests/unit/services.test.ts`):
- `examService`: getAll, getById, create (válido/inválido), update, delete
- `specialtyService`: getAll, create (válido/inválido), update, delete
- `healthPlanService`: getAll, create (válido/inválido), update, delete
- `viaCepService`: consulta válida, CEP inválido, CEP não encontrado

### Frontend

**Hooks Testáveis:**
- `useExams`: fetch, add, update, delete com estados de loading/error
- `useSpecialties`: fetch, add, update, delete
- `useHealthPlans`: fetch, add, update, delete

---

## CI/CD — GitHub Actions

**Arquivo:** `.github/workflows/ci.yml`

**Jobs:**

| Job | Trigger | Descrição |
|-----|---------|-----------|
| `backend-tests` | push/PR | Instala deps, gera Prisma client, roda testes com cobertura |
| `frontend-tests` | push/PR | Instala deps, roda testes, build de produção |
| `code-quality` | após testes | TypeScript check (backend + frontend) |
| `sonarcloud` | push (main/develop) | Análise estática com SonarCloud |

**Segredos necessários no repositório:**
- `SONAR_TOKEN` — Token do SonarCloud

---

## Arquitetura

### Backend (MVC por camadas)
```
Routes → Controllers → Services → Repositories → Prisma (PostgreSQL)
```

### Frontend (React Hooks)
```
Pages → Hooks → Services (Axios) → API Backend
```

---

## Estatísticas Sprint 3

| Métrica | Valor |
|---------|-------|
| Novos modelos Prisma | 3 (Exam, Specialty, HealthPlan) |
| Novos endpoints API | 17 |
| Novos serviços backend | 4 (examService, specialtyService, healthPlanService, viaCepService) |
| Novas páginas frontend | 6 |
| Novos hooks React | 3 |
| Novos testes adicionados | ~30 |
| CI/CD pipelines | 4 jobs |

---

## Como Executar

```bash
# Backend
cd backend
npm install
npx prisma generate
npm run dev

# Frontend
cd frontend
npm install
npm run dev

# Testes Backend
cd backend
npm test

# Testes Frontend
cd frontend
npm test
```

---

## Integrações Externas

| API | Endpoint | Uso |
|-----|----------|-----|
| ViaCEP | `https://viacep.com.br/ws/{cep}/json/` | Consulta de endereço por CEP |
| Nominatim | `https://nominatim.openstreetmap.org/search` | Geolocalização de endereços |
| Overpass API | `https://overpass-api.de/api/interpreter` | Clínicas próximas |
| SonarCloud | GitHub Actions | Análise de qualidade de código |
