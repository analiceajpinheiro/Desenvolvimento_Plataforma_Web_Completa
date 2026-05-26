# Modelagem do Banco de Dados — VitaLink

## Visão Geral

O banco de dados da plataforma VitaLink foi modelado com PostgreSQL e gerenciado via Prisma ORM. O modelo segue as melhores práticas de normalização e relacionamentos, garantindo integridade referencial e escalabilidade.

---

## 📊 Diagrama de Entidades e Relacionamentos

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────────┐         ┌──────────────────┐                 │
│  │   USER       │         │   PATIENT        │                 │
│  ├──────────────┤         ├──────────────────┤                 │
│  │ id (PK)      │         │ id (PK)          │                 │
│  │ email (UQ)   │         │ cpf (UQ)         │                 │
│  │ name         │         │ name             │                 │
│  │ password     │         │ birthDate        │                 │
│  │ role         │◄────────┤ gender           │                 │
│  │ specialty    │  N:1    │ phone            │                 │
│  │ isActive     │         │ email (UQ)       │                 │
│  │ createdAt    │         │ address          │                 │
│  │ updatedAt    │         │ cep              │                 │
│  └──────────────┘         │ latitude         │                 │
│        ▲                   │ longitude        │                 │
│        │ 1:N              │ createdAt        │                 │
│        │                  │ updatedAt        │                 │
│        │                  └──────────────────┘                 │
│        │                         ▲                             │
│        │                         │ 1:N                         │
│        │                         │                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              APPOINTMENT                                │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ id (PK)          date             status              │  │
│  │ doctorId (FK)    notes            createdAt           │  │
│  │ patientId (FK)   updatedAt                            │  │
│  └────────────┬──────────────────────────────┬───────────┘  │
│               │                              │               │
│               │ 1:N                         │ 1:1            │
│               │                              ▼               │
│               │                     ┌─────────────────────┐  │
│               │                     │ MEDICAL_RECORD      │  │
│               │                     ├─────────────────────┤  │
│               │                     │ id (PK)             │  │
│               │                     │ mainComplaint       │  │
│               │                     │ history             │  │
│               │                     │ physicalExam        │  │
│               │                     │ diagnosis           │  │
│               │                     │ treatment           │  │
│               │                     │ doctorId (FK)       │  │
│               │                     │ patientId (FK)      │  │
│               │                     │ appointmentId (UQ)  │  │
│               │                     │ createdAt           │  │
│               │                     │ updatedAt           │  │
│               │                     └──────┬──────────────┘  │
│               │                            │                 │
│               │                            │ 1:N              │
│               │                            ▼                 │
│               │                     ┌─────────────────────┐  │
│               │                     │ PRESCRIPTION        │  │
│               │                     ├─────────────────────┤  │
│               │                     │ id (PK)             │  │
│               │                     │ medication          │  │
│               │                     │ dosage              │  │
│               │                     │ frequency           │  │
│               │                     │ duration            │  │
│               │                     │ notes               │  │
│               │                     │ doctorId (FK)       │  │
│               │                     │ medicalRecordId(FK) │  │
│               │                     │ createdAt           │  │
│               │                     └─────────────────────┘  │
│               │                                               │
│               │ 1:N                                           │
│               ▼                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              EXAM                                       │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ id (PK)          name             status              │  │
│  │ patientId (FK)   description      scheduledAt         │  │
│  │ doctorId (FK)    result           completedAt         │  │
│  │ type             createdAt        updatedAt           │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              SPECIALTY                                  │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ id (PK)          name (UQ)                            │  │
│  │ description      isActive                            │  │
│  │ createdAt        updatedAt                           │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              HEALTH_PLAN                                │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ id (PK)          planName                            │  │
│  │ patientId (FK)   provider                            │  │
│  │ planNumber (UQ)  validUntil                          │  │
│  │ notes            isActive                            │  │
│  │ createdAt        updatedAt                           │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Descrição das Entidades

### 1. **User** (Usuários / Equipe)
Representa médicos, recepcionistas e administradores do sistema.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | CUID | PK | Identificador único |
| `email` | String | UQ | Email único para login |
| `name` | String | NOT NULL | Nome completo |
| `password` | String | NOT NULL | Senha criptografada (bcrypt) |
| `role` | Enum | DEFAULT: RECEPTIONIST | DOCTOR, RECEPTIONIST, ADMIN |
| `specialty` | String | NULLABLE | Especialidade (para médicos) |
| `isActive` | Boolean | DEFAULT: true | Status de atividade |
| `createdAt` | DateTime | DEFAULT: now() | Data de criação |
| `updatedAt` | DateTime | AUTO | Última atualização |

---

### 2. **Patient** (Pacientes)
Armazena dados demográficos e de localização dos pacientes.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | CUID | PK | Identificador único |
| `name` | String | NOT NULL | Nome completo |
| `cpf` | String | UQ | CPF único (validação CNPJ) |
| `birthDate` | DateTime | NOT NULL | Data de nascimento |
| `gender` | String | NOT NULL | Gênero |
| `phone` | String | NOT NULL | Telefone para contato |
| `email` | String | UQ | Email único |
| `address` | String | NOT NULL | Endereço completo |
| `cep` | String | NULLABLE | CEP (integração ViaCEP) |
| `latitude` | Float | NULLABLE | Latitude (Nominatim/Overpass) |
| `longitude` | Float | NULLABLE | Longitude (Nominatim/Overpass) |
| `createdAt` | DateTime | DEFAULT: now() | Data de criação |
| `updatedAt` | DateTime | AUTO | Última atualização |

---

### 3. **Appointment** (Agendamentos)
Registra consultas agendadas entre pacientes e médicos.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | CUID | PK | Identificador único |
| `date` | DateTime | NOT NULL | Data/hora da consulta |
| `status` | Enum | DEFAULT: CONFIRMED | CONFIRMED, CANCELLED, COMPLETED, RESCHEDULED |
| `notes` | String | NULLABLE | Observações da consulta |
| `doctorId` | String | FK → User | Médico responsável |
| `patientId` | String | FK → Patient | Paciente da consulta |
| `createdAt` | DateTime | DEFAULT: now() | Data de criação |
| `updatedAt` | DateTime | AUTO | Última atualização |

**Relacionamentos:**
- Um médico (User) pode ter N consultas
- Um paciente (Patient) pode ter N consultas
- Uma consulta pode ter 1 prontuário (1:1)

---

### 4. **MedicalRecord** (Prontuários)
Registro clínico detalhado de atendimento realizado.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | CUID | PK | Identificador único |
| `mainComplaint` | String | NOT NULL | Queixa principal |
| `history` | String | NULLABLE | Histórico clínico |
| `physicalExam` | String | NULLABLE | Achados do exame físico |
| `diagnosis` | String | NULLABLE | Diagnóstico |
| `treatment` | String | NULLABLE | Plano terapêutico |
| `doctorId` | String | FK → User | Médico que registrou |
| `patientId` | String | FK → Patient | Paciente do prontuário |
| `appointmentId` | String | UQ, FK → Appointment | Consulta associada |
| `createdAt` | DateTime | DEFAULT: now() | Data de criação |
| `updatedAt` | DateTime | AUTO | Última atualização |

**Relacionamentos:**
- Um prontuário vinculado a exatamente 1 consulta (1:1)
- Um médico pode ter N prontuários
- Um paciente pode ter N prontuários

---

### 5. **Prescription** (Prescrições)
Medicamentos prescritos durante consulta.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | CUID | PK | Identificador único |
| `medication` | String | NOT NULL | Nome do medicamento |
| `dosage` | String | NOT NULL | Dosagem (ex: 500mg) |
| `frequency` | String | NOT NULL | Frequência (ex: 8 em 8 horas) |
| `duration` | String | NOT NULL | Duração do tratamento |
| `notes` | String | NULLABLE | Observações adicionais |
| `doctorId` | String | FK → User | Médico prescritor |
| `medicalRecordId` | String | FK → MedicalRecord | Prontuário associado |
| `createdAt` | DateTime | DEFAULT: now() | Data de criação |

**Relacionamentos:**
- Um prontuário pode ter N prescrições
- Um médico pode ter N prescrições

---

### 6. **Exam** (Exames)
Registra solicitações e resultados de exames complementares.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | CUID | PK | Identificador único |
| `name` | String | NOT NULL | Nome do exame |
| `type` | Enum | DEFAULT: LAB | LAB, IMAGE, FUNCTIONAL, OTHER |
| `description` | String | NULLABLE | Descrição/indicação |
| `result` | String | NULLABLE | Resultado do exame |
| `status` | Enum | DEFAULT: REQUESTED | REQUESTED, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED |
| `scheduledAt` | DateTime | NULLABLE | Agendamento do exame |
| `completedAt` | DateTime | NULLABLE | Conclusão do exame |
| `patientId` | String | FK → Patient | Paciente |
| `doctorId` | String | FK → User | Médico solicitante |
| `createdAt` | DateTime | DEFAULT: now() | Data de criação |
| `updatedAt` | DateTime | AUTO | Última atualização |

**Relacionamentos:**
- Um paciente pode ter N exames
- Um médico pode ter N exames

---

### 7. **Specialty** (Especialidades)
Catálogo de especialidades médicas.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | CUID | PK | Identificador único |
| `name` | String | UQ | Nome da especialidade |
| `description` | String | NULLABLE | Descrição |
| `isActive` | Boolean | DEFAULT: true | Status de atividade |
| `createdAt` | DateTime | DEFAULT: now() | Data de criação |
| `updatedAt` | DateTime | AUTO | Última atualização |

---

### 8. **HealthPlan** (Convênios / Planos de Saúde)
Informações de cobertura de saúde dos pacientes.

| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | CUID | PK | Identificador único |
| `planName` | String | NOT NULL | Nome do plano (ex: "Bradesco Saúde") |
| `provider` | String | NOT NULL | Operadora/Fornecedor |
| `planNumber` | String | UQ | Número da carteira |
| `validUntil` | DateTime | NOT NULL | Validade do plano |
| `notes` | String | NULLABLE | Observações |
| `isActive` | Boolean | DEFAULT: true | Status de atividade |
| `patientId` | String | FK → Patient | Paciente |
| `createdAt` | DateTime | DEFAULT: now() | Data de criação |
| `updatedAt` | DateTime | AUTO | Última atualização |

**Relacionamentos:**
- Um paciente pode ter N planos de saúde

---

## 🔑 Enumerações

### Role (User)
```
DOCTOR       - Médico (pode registrar prontuários)
RECEPTIONIST - Recepcionista (agenda e gerencia pacientes)
ADMIN        - Administrador (acesso total)
```

### AppointmentStatus
```
CONFIRMED    - Consulta confirmada
CANCELLED    - Consulta cancelada
COMPLETED    - Consulta realizada
RESCHEDULED  - Consulta reagendada
```

### ExamType
```
LAB          - Exame laboratorial
IMAGE        - Exame de imagem (raio-x, ultrassom, etc)
FUNCTIONAL   - Teste funcional (EKG, etc)
OTHER        - Outros tipos
```

### ExamStatus
```
REQUESTED    - Exame solicitado
SCHEDULED    - Agendado
IN_PROGRESS  - Em andamento
COMPLETED    - Concluído
CANCELLED    - Cancelado
```

---

## 🔗 Relacionamentos Principais

| De | Para | Tipo | Descrição |
|---|---|---|---|
| User | Appointment | 1:N | Um médico realiza N consultas |
| User | MedicalRecord | 1:N | Um médico registra N prontuários |
| User | Prescription | 1:N | Um médico prescreve N medicamentos |
| User | Exam | 1:N | Um médico solicita N exames |
| Patient | Appointment | 1:N | Um paciente tem N consultas |
| Patient | MedicalRecord | 1:N | Um paciente tem N prontuários |
| Patient | Exam | 1:N | Um paciente tem N exames |
| Patient | HealthPlan | 1:N | Um paciente tem N planos |
| Appointment | MedicalRecord | 1:1 | Uma consulta gera 1 prontuário |
| MedicalRecord | Prescription | 1:N | Um prontuário tem N prescrições |

---

## ✅ Integridade Referencial

Todas as chaves estrangeiras seguem o padrão **CASCADE DELETE** onde apropriado:
- Deletar um paciente remove seus agendamentos, prontuários e exames
- Deletar um agendamento remove seu prontuário associado
- Deletar um prontuário remove suas prescrições
- Deletar um usuário mantém registros históricos (soft delete via `isActive`)

---

## 📈 Escalabilidade

O modelo foi projetado para:
- ✅ Suportar múltiplas clínicas (via expansão futura)
- ✅ Auditoria completa (timestamps em todas as entidades)
- ✅ Busca eficiente (índices em chaves estrangeiras)
- ✅ Conformidade LGPD (retenção de dados com soft delete)
- ✅ Integração com APIs externas (Nominatim, ViaCEP, Overpass)

