# 🚀 Backend VitaLink - Guia de Setup e Execução

## 📋 Pré-requisitos

- **Node.js** >= 18.x
- **PostgreSQL** >= 15.x
- **npm** >= 9.x
- **Git**

---

## 🔧 Instalação e Setup

### 1. Clonar e Entrar no Diretório Backend

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vitalink"
PORT=3333
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Configurar Banco de Dados

```bash
# Criar as migrations do Prisma
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para visualizar dados
npx prisma studio
```

---

## ▶️ Executando a Aplicação

### Modo Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3333`

### Modo Produção

```bash
npm run build
npm start
```

---

## 🧪 Executando Testes

### Testes Unitários

```bash
npm run test

# Com watch mode (reexecuta ao salvar)
npm run test:watch

# Com cobertura de código
npm run test:coverage
```

### Testes de Integração

```bash
npm run test -- --testPathPattern=integration
```

### Todos os Testes

```bash
npm test
```

---

## 📊 Estrutura de Pastas

```
backend/
├── src/
│   ├── controllers/        # Lógica dos endpoints
│   ├── services/           # Regras de negócio
│   ├── repositories/       # Acesso ao banco de dados
│   ├── middlewares/        # Autenticação, validação, erros
│   ├── routes/             # Definição de rotas
│   ├── types/              # Interfaces TypeScript
│   ├── utils/              # Validadores, helpers, erros customizados
│   └── index.ts            # Ponto de entrada
├── prisma/
│   ├── schema.prisma       # Definição do modelo do banco
│   └── migrations/         # Histórico de migrations (auto-gerado)
├── tests/
│   ├── unit/               # Testes unitários
│   └── integration/        # Testes de integração
├── jest.config.js          # Configuração do Jest
├── tsconfig.json           # Configuração do TypeScript
├── package.json            # Dependências e scripts
└── .env.example            # Variáveis de ambiente
```

---

## 🔐 Autenticação

### Registro de Novo Usuário

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Dr. João",
  "email": "dr.joao@example.com",
  "password": "Senha123",
  "role": "DOCTOR",
  "specialty": "Cardiologia"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "dr.joao@example.com",
  "password": "Senha123"
}

# Resposta:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGc..." 
  }
}
```

### Usar Token em Requisições

```bash
Authorization: Bearer eyJhbGc...
```

---

## 👥 Endpoints Principais

### Pacientes (CRUD)

```bash
# Listar pacientes (paginado)
GET /api/patients?page=1&limit=10
Authorization: Bearer {token}

# Buscar pacientes
GET /api/patients/search?q=João
Authorization: Bearer {token}

# Obter paciente por ID
GET /api/patients/:id
Authorization: Bearer {token}

# Criar paciente
POST /api/patients
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva",
  "cpf": "11144477735",
  "birthDate": "1990-05-15",
  "gender": "M",
  "phone": "11987654321",
  "email": "joao@example.com",
  "address": "Rua A, 123"
}

# Atualizar paciente
PUT /api/patients/:id
Authorization: Bearer {token}

# Deletar paciente
DELETE /api/patients/:id
Authorization: Bearer {token}

# Clínicas próximas ao paciente
GET /api/patients/:id/nearby-clinics
Authorization: Bearer {token}
```

### Agendamentos (CRUD)

```bash
# Listar agendamentos
GET /api/appointments?page=1&limit=10
Authorization: Bearer {token}

# Agendamentos do paciente
GET /api/patients/:patientId/appointments
Authorization: Bearer {token}

# Agendamentos do médico
GET /api/doctors/:doctorId/appointments
Authorization: Bearer {token}

# Horários disponíveis do médico
GET /api/doctors/:doctorId/available-slots?date=2024-12-25
Authorization: Bearer {token}

# Criar agendamento
POST /api/appointments
Authorization: Bearer {token}
Content-Type: application/json

{
  "patientId": "patient-1",
  "doctorId": "doctor-1",
  "date": "2024-12-25T14:00:00Z",
  "notes": "Consulta de rotina"
}

# Atualizar agendamento
PUT /api/appointments/:id
Authorization: Bearer {token}

# Cancelar agendamento
PATCH /api/appointments/:id/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Paciente não compareceu"
}
```

### Usuários

```bash
# Listar usuários (role opcional: DOCTOR, RECEPTIONIST, ADMIN)
GET /api/users?page=1&limit=10&role=DOCTOR
Authorization: Bearer {token}

# Obter usuário por ID
GET /api/users/:id
Authorization: Bearer {token}

# Atualizar usuário (apenas ADMIN)
PUT /api/users/:id
Authorization: Bearer {token}

# Deletar usuário (apenas ADMIN)
DELETE /api/users/:id
Authorization: Bearer {token}

# Alterar senha
POST /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "SenhaAntiga123",
  "newPassword": "SenhaNovaValida123"
}
```

---

## 🔗 Integração com APIs Externas

### Nominatim (OpenStreetMap)

Usado para obter coordenadas (latitude, longitude) de um endereço.

```typescript
// Exemplo:
const coordinates = await patientService.getCoordinates(
  "Rua A, 123 - São Paulo, SP"
);
// Retorna: { latitude: -23.5505, longitude: -46.6333 }
```

### Overpass API

Usado para buscar clínicas e farmácias próximas.

```typescript
// Exemplo:
const clinics = await patientService.findNearbyPlaces(
  -23.5505,  // latitude
  -46.6333,  // longitude
  'clinic',  // tipo de lugar
  5000       // raio em metros
);
```

---

## ✅ Cobertura de Testes

### Testes Unitários Implementados

✅ **Validadores**
- CPF (com checksum)
- Email (RFC-compliant)
- Telefone (11 dígitos)
- Senha (força mínima)
- Input de Paciente (todos os campos)
- Input de Usuário (todos os campos)

✅ **Auth Service**
- Registro de novo usuário
- Login com credenciais
- Geração e verificação de token JWT
- Alteração de senha

✅ **Repositories**
- User CRUD
- Patient CRUD
- Appointment CRUD
- Detecção de conflitos de agendamento

### Testes de Integração Implementados

✅ **Auth Endpoints**
- Registro de usuário
- Login
- Mudança de senha

✅ **Patient Endpoints**
- Listar pacientes
- Buscar pacientes
- Criar paciente
- Atualizar paciente
- Deletar paciente

✅ **Appointment Endpoints**
- Listar agendamentos
- Criar agendamento
- Cancelar agendamento
- Obter horários disponíveis

✅ **Error Handling**
- Validação de entrada
- Token inválido
- Recursos não encontrados
- Dados duplicados (CPF, email)

---

## 🚨 Tratamento de Erros

Todos os erros seguem este padrão:

```json
{
  "success": false,
  "message": "Descrição do erro",
  "code": "ERRO_CODE"
}
```

**Códigos de Erro:**
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `INTERNAL_SERVER_ERROR` (500)

---

## 📚 Documentação Adicional

- [Casos de Uso](../docs/casos-de-uso.md)
- [Testes](../docs/casos-de-teste.md)
- [Schema do Banco](../docs/modelagem-bd.md)

---

## 💡 Próximos Passos

1. **Implementar Email Notifications**
   - Configurar nodemailer
   - Enviar confirmação de agendamento
   - Lembrete de consultas

2. **Adicionar Prontuário Eletrônico**
   - CRUD de MedicalRecord
   - CRUD de Prescription
   - Upload de arquivos

3. **Dashboard Analytics**
   - Estatísticas de pacientes
   - Agendamentos por período
   - Relatórios de desempenho

4. **Melhorias de Segurança**
   - Rate limiting
   - CORS mais restritivo
   - Validação de MIME types
   - Helmet.js para headers

---

**Desenvolvido com ❤️ para VitaLink**
