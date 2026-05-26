# Relatório de Auditoria — VitaLink (Sprint 3)

**Data:** 2026-05-25  
**Projeto:** VitaLink — Plataforma de Gestão em Saúde  
**Branch:** main  

---

## PARTE 1 — O QUE FOI FEITO

### CRUDs implementados (Backend + Frontend)

| CRUD | Rotas Backend | Serviço | Repositório | Páginas Frontend | Hooks |
|------|--------------|---------|-------------|-----------------|-------|
| **Pacientes** | 7 rotas (GET, POST, PUT, DELETE, search, nearby-clinics, /appointments) | ✅ 6 métodos | ✅ 7 métodos | PatientsList + PatientsForm | usePatients |
| **Agendamentos** | 8 rotas | ✅ 7 métodos | ✅ 8 métodos | AppointmentsList + AppointmentsForm | useAppointments |
| **Prontuários** | 6 rotas | ✅ 5 métodos | ✅ 6 métodos | MedicalRecordsList + MedicalRecordsForm | useMedicalRecords |
| **Prescrições** | 5 rotas (nested em /medical-records) | ✅ 5 métodos | ✅ 5 métodos | Embutido em MedicalRecordsForm | — |
| **Usuários** | 4 rotas | ✅ 4 métodos | ✅ 6 métodos | UsersList + UsersForm | — |
| **Exames** | 5 rotas | ✅ 5 métodos | ✅ 5 métodos | ExamsList + ExamsForm | useExams |
| **Especialidades** | 5 rotas | ✅ 5 métodos | ✅ 6 métodos | SpecialtiesList + SpecialtiesForm | useSpecialties |
| **Convênios** | 6 rotas | ✅ 5 métodos | ✅ 6 métodos | HealthPlansList + HealthPlansForm | useHealthPlans |

**Total: 48 rotas no backend, 22 rotas no frontend, 16 páginas**

---

### Rotas Backend (48 rotas registradas)

#### AUTH
- `POST /auth/register` — Registrar novo usuário
- `POST /auth/login` — Fazer login
- `POST /auth/change-password` — Alterar senha (requer auth)

#### USERS
- `GET /users` — Listar usuários
- `GET /users/:id` — Obter usuário por ID
- `PUT /users/:id` — Atualizar usuário (ADMIN)
- `DELETE /users/:id` — Deletar usuário (ADMIN)

#### PATIENTS
- `GET /patients` — Listar pacientes
- `GET /patients/search` — Buscar pacientes por nome/CPF/email
- `POST /patients` — Criar paciente (DOCTOR, RECEPTIONIST, ADMIN)
- `GET /patients/:id` — Obter paciente por ID
- `PUT /patients/:id` — Atualizar paciente
- `DELETE /patients/:id` — Deletar paciente
- `GET /patients/:id/nearby-clinics` — Buscar clínicas próximas (Nominatim)

#### APPOINTMENTS
- `GET /appointments` — Listar agendamentos
- `POST /appointments` — Criar agendamento
- `GET /appointments/:id` — Obter agendamento por ID
- `PUT /appointments/:id` — Atualizar agendamento
- `PATCH /appointments/:id/cancel` — Cancelar agendamento
- `GET /patients/:patientId/appointments` — Agendamentos do paciente
- `GET /doctors/:doctorId/appointments` — Agendamentos do médico
- `GET /doctors/:doctorId/available-slots` — Horários disponíveis

#### MEDICAL RECORDS
- `GET /medical-records` — Listar prontuários
- `GET /medical-records/:id` — Obter prontuário por ID
- `POST /medical-records` — Criar prontuário (DOCTOR, ADMIN)
- `PUT /medical-records/:id` — Atualizar prontuário (DOCTOR, ADMIN)
- `DELETE /medical-records/:id` — Deletar prontuário (ADMIN)
- `GET /patients/:id/medical-records` — Prontuários do paciente

#### PRESCRIPTIONS
- `GET /medical-records/:id/prescriptions` — Listar prescrições
- `POST /medical-records/:id/prescriptions` — Criar prescrição (DOCTOR, ADMIN)
- `GET /prescriptions/:id` — Obter prescrição por ID
- `PUT /prescriptions/:id` — Atualizar prescrição
- `DELETE /prescriptions/:id` — Deletar prescrição

#### EXAMS (Sprint 3)
- `GET /exams` — Listar exames
- `POST /exams` — Criar exame (DOCTOR, ADMIN)
- `GET /exams/:id` — Obter exame por ID
- `PUT /exams/:id` — Atualizar exame
- `DELETE /exams/:id` — Deletar exame

#### SPECIALTIES (Sprint 3)
- `GET /specialties` — Listar especialidades
- `POST /specialties` — Criar especialidade (ADMIN)
- `GET /specialties/:id` — Obter especialidade por ID
- `PUT /specialties/:id` — Atualizar especialidade (ADMIN)
- `DELETE /specialties/:id` — Deletar especialidade (ADMIN)

#### HEALTH PLANS (Sprint 3)
- `GET /health-plans` — Listar convênios
- `POST /health-plans` — Criar convênio
- `GET /health-plans/:id` — Obter convênio por ID
- `PUT /health-plans/:id` — Atualizar convênio
- `DELETE /health-plans/:id` — Deletar convênio (ADMIN)
- `GET /patients/:patientId/health-plans` — Convênios do paciente

#### VIA CEP (Sprint 3)
- `GET /address/cep/:cep` — Consultar endereço por CEP

---

### Testes existentes

| Arquivo | Tipo | Casos (it) |
|--------|------|-----------|
| `backend/tests/unit/auth.service.test.ts` | Unitário backend | ~11 casos |
| `backend/tests/unit/validators.test.ts` | Unitário backend | ~27 casos |
| `backend/tests/unit/repositories.test.ts` | Unitário backend | ~17 casos |
| `backend/tests/unit/services.test.ts` | Unitário backend | ~22 casos |
| `backend/tests/integration/api.test.ts` | Integração backend | 24 casos |
| `frontend/src/utils/validators.test.ts` | Unitário frontend | 13 casos |
| **TOTAL** | | **~114 casos** |

**Resultado ao rodar `npm test` (backend):** 102 passando, 1 falhando.

---

### Integrações com API externa

| Integração | Onde | Detalhes |
|-----------|------|----------|
| **ViaCEP** | Backend (`viaCepService`) + Frontend (`cepService`) | `https://viacep.com.br/ws/{cep}/json/` — auto-preenchimento de endereço no formulário de pacientes |
| **Nominatim** | Backend (`patientService.getCoordinates`) | `https://nominatim.openstreetmap.org/search` — geocodifica endereço para lat/lon |
| **Overpass API** | Backend (`patientService.findNearbyPlaces`) | Busca clínicas próximas com base nas coordenadas do paciente |

---

### Documentação em `docs/`

| Arquivo | Tamanho | Conteúdo |
|--------|---------|----------|
| `docs/SPRINT_2.md` | 7.488 bytes | Funcionalidades, modelos, testes da Sprint 2 |
| `docs/SPRINT_3.md` | 5.871 bytes | Endpoints, modelos, testes da Sprint 3 |
| `docs/casos-de-uso.md` | 10.541 bytes | Casos de uso do sistema |
| `docs/casos-de-teste.md` | 12.548 bytes | Casos de teste documentados |

---

### CI/CD e SonarCloud

**`.github/workflows/ci.yml`** — 4 jobs configurados:

| Job | Runner | O que faz |
|-----|--------|-----------|
| `backend-tests` | ubuntu-latest | Instala, gera Prisma client, roda `test:coverage`, faz upload do `lcov.info` |
| `frontend-tests` | ubuntu-latest | Instala, roda testes, faz build, upload do artefato `dist` |
| `code-quality` | ubuntu-latest | Type-check via `tsc --noEmit` no backend e frontend |
| `sonarcloud` | ubuntu-latest | Roda coberturas e envia para o SonarCloud (requer secret `SONAR_TOKEN`) |

**`sonar-project.properties`** — configurado com:
- `sonar.projectKey=vitacase-plataforma-saude`
- `sonar.sources=frontend/src,backend/src`
- `sonar.lcov.reportPaths=backend/coverage/lcov.info,frontend/coverage/lcov.info`

---

## PARTE 2 — O QUE ESTÁ QUEBRADO OU INCOMPLETO

### Teste falhando ao rodar `npm test`

```
FAIL tests/integration/api.test.ts

● API Integration Tests › Patient Routes › GET /api/patients/search deve buscar pacientes
  Expected: 200
  Received: 400
```

**Causa provável:** O teste envia `?q=João` (com o caractere especial `ã`). O supertest pode estar enviando o caractere sem URL-encode, fazendo com que `req.query.q` chegue como `undefined` ou string vazia no servidor. O `patientService.searchPatients` real valida que `query` não seja vazio e lança `ValidationError`, resultando em 400. Como o mock pode não estar interceptando a chamada corretamente nesse cenário, o serviço real é acionado.

**Correção sugerida** (no arquivo `backend/tests/integration/api.test.ts`, linha 210):
```typescript
// De:
.get('/api/patients/search?q=João')
// Para (URL-encoded):
.get('/api/patients/search?q=Jo%C3%A3o')
// E ajustar a expectativa na linha 215:
expect(patientService.searchPatients).toHaveBeenCalledWith('João', 10);
```

---

### Testes E2E — inexistentes

O `package.json` do frontend lista `cypress` como dependência e expõe os scripts `cypress:open` e `cypress:run`, mas **não existe nenhum arquivo de teste Cypress** no projeto. Não há pasta `cypress/e2e/` com specs `.cy.ts`.

---

### Rotas do backend sem tela dedicada no frontend

| Rota | Situação |
|------|----------|
| `GET /prescriptions/:id`, `PUT/DELETE /prescriptions/:id` | Prescrições sem página própria; gerenciadas dentro de `MedicalRecordsForm` |
| `GET /patients/:id/nearby-clinics` | Funcionalidade existe no backend e hook, mas não há tela dedicada de "Clínicas Próximas" no frontend |

---

### Inconsistências de padrão

- **`UsersList` e `UsersForm`** existem como páginas, mas não há hook `useUsers.ts` — o padrão do projeto usa hooks para todos os outros módulos.
- **Prescrições** não têm rota própria no React Router nem página independente, ao contrário de todos os outros módulos.

---

## PARTE 3 — O QUE FALTA PARA A SPRINT 3

### Alta prioridade

| O que falta | Esforço estimado |
|-------------|-----------------|
| Corrigir o 1 teste de integração falhando (`search?q=João`) | 5 min |
| Criar testes E2E com Cypress (ao menos login, pacientes, agendamentos) | 2–3h |

### Média prioridade

| O que falta | Esforço estimado |
|-------------|-----------------|
| Criar hook `useUsers.ts` (consistência com padrão do projeto) | 30 min |
| Configurar o secret `SONAR_TOKEN` no GitHub (Settings → Secrets) | 5 min |
| Ampliar testes unitários backend dos novos services (mais cenários negativos) | 1h |

### Baixa prioridade

| O que falta | Esforço estimado |
|-------------|-----------------|
| Testes unitários para hooks frontend (`useExams`, `useSpecialties`, `useHealthPlans`) | 1–2h |
| Testes de componentes React (PatientsList, ExamsList, etc.) | 2–3h |
| Página dedicada para prescrições (opcional, depende do escopo da sprint) | 2h |

---

## PARTE 4 — RESUMO FINAL

| Item | Status | O que falta |
|------|--------|-------------|
| CRUD Pacientes | ✅ Completo | — |
| CRUD Agendamentos | ✅ Completo | — |
| CRUD Prontuários | ✅ Completo | Prescrições sem página própria |
| CRUD Exames | ✅ Completo | Mais cenários de teste de integração |
| CRUD Especialidades | ✅ Completo | — |
| CRUD Convênios | ✅ Completo | — |
| CRUD Usuários | ⚠️ Parcial | Falta hook `useUsers` |
| Login | ✅ Completo | — |
| Dashboard | ✅ Completo | — |
| Testes unitários backend | ✅ Completo | ~114 casos; 102/103 passando |
| Testes de integração backend | ⚠️ Parcial | 1 teste falhando (search com `ã`) |
| Testes E2E (Cypress) | ❌ Não existe | Criar specs para login, pacientes, agendamentos |
| Testes unitários frontend | ⚠️ Parcial | Só validators; falta hooks e componentes |
| Documentação — casos de uso | ✅ Completo | `docs/casos-de-uso.md` existe |
| Documentação — casos de teste | ✅ Completo | `docs/casos-de-teste.md` existe |
| CI/CD (GitHub Actions) | ✅ Completo | 4 jobs configurados |
| SonarCloud | ✅ Completo | Precisa do secret `SONAR_TOKEN` no repositório GitHub |
| Integração Nominatim | ✅ Completo | Backend: geocodificação + clínicas próximas |
| Integração ViaCEP | ✅ Completo | Backend + frontend (formulário de pacientes) |

---

### Percentual estimado de conclusão: 88–90%

**Itens críticos para a entrega (por prioridade):**

1. 🔴 **Corrigir o teste falhando** — `GET /api/patients/search?q=João` retorna 400 em vez de 200
2. 🔴 **Criar testes E2E com Cypress** — maior lacuna; Cypress está instalado mas sem nenhum spec
3. 🟡 **Configurar `SONAR_TOKEN`** no GitHub para o job SonarCloud funcionar no CI
4. 🟡 **Criar hook `useUsers`** — consistência com o padrão arquitetural do projeto
5. 🟢 **Ampliar testes unitários frontend** — hooks e componentes dos 3 novos CRUDs da Sprint 3
