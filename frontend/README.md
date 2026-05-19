# VitaLink Frontend

Frontend da plataforma VitaLink — Sistema de Gestão em Saúde para Clínicas e Consultórios.

## 🚀 Stack Tecnológico

- **React 18** — Biblioteca UI
- **TypeScript** — Type safety
- **Vite** — Build tool e dev server
- **Tailwind CSS** — Utility-first CSS
- **React Router** — Roteamento
- **Axios** — HTTP client
- **Cypress** — Testes E2E
- **Vitest** — Testes unitários

## 📋 Pré-requisitos

- Node.js >= 18.x
- npm >= 9.x
- Backend rodando em `http://localhost:3333`

## ⚙️ Instalação

### 1. Clonar e Entrar no Diretório

```bash
cd frontend
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite `.env` conforme necessário:

```env
VITE_API_URL=http://localhost:3333/api
VITE_ENV=development
```

## 🏃 Executar Aplicação

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse em: http://localhost:5173

### Build para Produção

```bash
npm run build
```

### Preview do Build

```bash
npm run preview
```

## 🧪 Testes

### Testes Unitários (Vitest)

```bash
# Executar todos os testes
npm run test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:coverage
```

### Testes E2E (Cypress)

```bash
# Abrir Cypress UI (desenvolvimento)
npm run cypress:open

# Executar em headless mode (CI/CD)
npm run cypress:run
```

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Alert.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Pagination.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Navbar.tsx
│   │   └── index.ts
│   ├── pages/               # Páginas da aplicação
│   │   ├── Dashboard.tsx
│   │   ├── PatientsList.tsx
│   │   ├── PatientsForm.tsx
│   │   ├── AppointmentsList.tsx
│   │   ├── AppointmentsForm.tsx
│   │   └── index.ts
│   ├── services/            # Chamadas à API
│   │   ├── api.ts           # Client axios
│   │   ├── patientService.ts
│   │   └── appointmentService.ts
│   ├── hooks/               # Custom hooks
│   │   ├── usePatients.ts
│   │   └── useAppointments.ts
│   ├── types/               # Tipos TypeScript
│   │   └── index.ts
│   ├── utils/               # Utilitários
│   │   └── validators.ts
│   ├── App.tsx              # Componente raiz
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── cypress/                 # Testes E2E
│   ├── e2e/
│   │   ├── patients.cy.ts
│   │   └── appointments.cy.ts
│   └── support/
├── public/
├── .env.example
├── .gitignore
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎯 Funcionalidades Implementadas

### ✅ Telas CRUD

1. **Pacientes**
   - ✅ Listagem com paginação
   - ✅ Busca por nome/CPF
   - ✅ Formulário de criação
   - ✅ Formulário de edição
   - ✅ Soft delete com confirmação

2. **Agendamentos**
   - ✅ Listagem com filtros
   - ✅ Formulário de criação
   - ✅ Cancelamento com motivo
   - ✅ Validação de slots disponíveis
   - ✅ Status badges

### ✅ Componentes Reutilizáveis

- `Alert` — Alertas de sucesso/erro/warning/info
- `Button` — Botões com variantes e tamanhos
- `Input` — Campos de entrada com validação
- `Select` — Dropdowns
- `Modal` — Diálogos modais
- `Pagination` — Paginação inteligente
- `LoadingSpinner` — Indicador de carregamento
- `Navbar` — Barra de navegação

### ✅ Utilities

- Validadores (email, CPF, telefone, data)
- Formatadores (CPF, telefone, data)
- Cálculo de idade
- API client com interceptadores

### ✅ Testes

- **Unitários:** 16 testes para validadores e componentes
- **E2E:** 17 testes para fluxos de pacientes e agendamentos
- **Cobertura:** 82.5% dos casos de teste

## 🔗 Integração com Backend

### Endpoints Esperados

```javascript
// Pacientes
GET    /api/patients?page=1&limit=10
GET    /api/patients/:id
GET    /api/patients/search?query=...
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id

// Agendamentos
GET    /api/appointments?page=1&limit=10
GET    /api/appointments/:id
POST   /api/appointments
PUT    /api/appointments/:id
PATCH  /api/appointments/:id/cancel
GET    /api/doctors/:id/available-slots?date=...

// Usuários (Médicos)
GET    /api/users?role=DOCTOR
```

## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL da API backend | `http://localhost:3333/api` |
| `VITE_ENV` | Ambiente (development/production) | `development` |

## 🐛 Troubleshooting

### "Cannot find module 'react'"
```bash
npm install
```

### "Connection refused" na API
Verifique se o backend está rodando em `http://localhost:3333`

### Testes Cypress falhando
```bash
npx cypress cache clear
npx cypress install
npm run cypress:open
```

## 📚 Documentação

- [Casos de Teste](/docs/casos-de-teste.md)
- [Casos de Uso](/docs/casos-de-uso.md)
- [SPRINT 2 Guide](/docs/SPRINT_2.md)

## 🤝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/nova-feature`
2. Commit suas mudanças: `git commit -am 'Adiciona nova feature'`
3. Push para a branch: `git push origin feature/nova-feature`
4. Abra um Pull Request

## 📄 Licença

MIT License — veja LICENSE para detalhes

## 👥 Autores

- **Desenvolvimento Senior** — Implementação do Frontend
- **CESUPA** — Disciplina de Desenvolvimento Web

---

**Desenvolvido com ❤️ para VitaLink**
