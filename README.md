# VitaCase — Plataforma de Gestão em Saúde

> Plataforma web completa para gerenciamento de consultas, pacientes, prontuários e monitoramento de saúde.

---

## Descrição do Projeto

O **VitaLink** é uma plataforma web voltada para clínicas e consultórios médicos de pequeno e médio porte, permitindo o gerenciamento digital de pacientes, agendamentos, prontuários eletrônicos e monitoramento de indicadores de saúde. A plataforma integra uma API externa de geolocalização para localizar clínicas e farmácias próximas ao paciente.

---

## Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Front-end | React + TypeScript | Reatividade, tipagem forte, grande comunidade e ecossistema |
| Estilização | Tailwind CSS | Utility-first, escalável, reduz CSS customizado |
| Back-end | Node.js + Express | JavaScript full-stack, leve, rápido e fácil de manter |
| Banco de Dados | PostgreSQL | Robustez, ACID compliance, suporte a dados estruturados |
| ORM | Prisma | Type-safe, migrations automatizadas, excelente DX |
| Testes Frontend | Vitest + React Testing Library | Rápido, moderno, integrado ao Vite |
| Testes Backend | Jest + Supertest | Testes unitários e integração confiáveis |
| Testes E2E | Cypress | Automação de testes de ponta a ponta, alta confiabilidade |
| API Externa | Nominatim/Overpass/ViaCEP | Geolocalização livre, sem custos |
| Autenticação | JWT + bcrypt | Segurança, stateless, padrão da indústria |
| Qualidade | SonarCloud | Análise estática, detecção de bugs e code smells |
| Versionamento | Git + GitHub | Controle de versão distribuído, CI/CD pronto 

---

##  Estrutura do Repositório

```
vitalink/
├── frontend/                  # React App
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Telas da aplicação
│   │   ├── services/          # Chamadas à API
│   │   ├── hooks/             # Custom hooks
│   │   └── types/             # Tipos TypeScript
│   └── cypress/               # Testes E2E
│
├── backend/                   # Node.js + Express
│   ├── src/
│   │   ├── controllers/       # Lógica dos endpoints
│   │   ├── services/          # Regras de negócio
│   │   ├── repositories/      # Acesso ao banco
│   │   ├── middlewares/       # Auth, validação, erros
│   │   ├── routes/            # Definição de rotas
│   │   └── utils/             # Utilitários
│   ├── prisma/
│   │   ├── schema.prisma      # Modelo do banco
│   │   └── migrations/        # Histórico de migrations
│   └── tests/                 # Testes unitários e integração
│
├── docs/                      # Documentação
│   ├── casos-de-uso.md
│   ├── casos-de-teste.md
│   └── modelagem-bd.md
│
└── README.md
```

---

## 📋 Requisitos de Sistema

### Software Obrigatório

| Software | Versão Mínima | Download | Verificação |
|---|---|---|---|
| Node.js | 18.x LTS | https://nodejs.org | `node -v` |
| npm | 9.x | Incluído no Node.js | `npm -v` |
| PostgreSQL | 15.x | https://www.postgresql.org/download/ | `psql --version` |
| Git | 2.x | https://git-scm.com | `git --version` |

### Dependências do Backend

```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "axios": "^1.4.0",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.0",
    "@types/cors": "^2.8.19",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.0",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/node": "^20.0.0",
    "@types/supertest": "^2.0.12",
    "jest": "^29.5.0",
    "prisma": "^5.0.0",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Dependências do Frontend

```json
{
  "dependencies": {
    "axios": "^1.4.0",
    "jsdom": "^29.1.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/react": "^14.3.1",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "@vitest/coverage-v8": "^4.1.7",
    "autoprefixer": "^10.4.14",
    "cypress": "^13.1.0",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0",
    "vite": "^8.0.13",
    "vitest": "^4.1.6"
  }
}
```

### Variáveis de Ambiente

#### Backend (.env)
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vitalink_db"

# JWT
JWT_SECRET="your_jwt_secret_key_here"
JWT_EXPIRY="8h"

# Server
PORT=3333
NODE_ENV="development"

# Email (opcional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu_email@gmail.com"
SMTP_PASS="sua_senha_app"

# API Externa
NOMINATIM_URL="https://nominatim.openstreetmap.org"
```

#### Frontend (.env)
```bash
# API Backend
VITE_API_URL=http://localhost:3333
VITE_API_TIMEOUT=10000

# Ambiente
VITE_ENV=development
```

---

## ⚙️ Instruções de Instalação

### 1. Pré-requisitos

Verifique se os softwares obrigatórios estão instalados:

```bash
node -v      # deve retornar v18.x ou superior
npm -v       # deve retornar 9.x ou superior
psql --version  # deve retornar PostgreSQL 15.x ou superior
git --version   # deve retornar Git 2.x ou superior
```

### 2. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/vitalink.git
cd vitalink
```

### 3. Configurar o Banco de Dados

```bash
# No PostgreSQL, criar um novo banco de dados
psql -U postgres

# No prompt psql:
CREATE DATABASE vitalink_db;
\q
```

### 4. Configurar o Back-end

```bash
cd backend

# Copiar arquivo de configuração
cp .env.example .env

# Editar .env com as credenciais do banco (se necessário)
# DATABASE_URL="postgresql://user:password@localhost:5432/vitalink_db"
# JWT_SECRET="gerar_uma_chave_segura_aqui"

# Instalar dependências
npm install

# Executar migrations do Prisma
npx prisma migrate dev --name init

# Seed do banco (dados iniciais)
npx prisma db seed

# Iniciar servidor de desenvolvimento
npm run dev
```

O backend estará rodando em: **http://localhost:3333**

### 5. Configurar o Front-end (em outro terminal)

```bash
cd frontend

# Copiar arquivo de configuração
cp .env.example .env

# Editar .env se a URL da API for diferente
# VITE_API_URL=http://localhost:3333

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: **http://localhost:5173**

### 6. Acessar a aplicação

- 🌐 **Frontend:** http://localhost:5173
- 🔌 **Backend API:** http://localhost:3333
- 📊 **Swagger Docs:** http://localhost:3333/api-docs (se implementado)

### 7. (Opcional) Executar Testes

```bash
# Backend
cd backend
npm run test
npm run test:coverage

# Frontend
cd frontend
npm run test
npm run test:ui

# E2E
cd frontend
npm run cypress:open
```

---

## 🌐 APIs Externas Integradas

### 1. **Nominatim (OpenStreetMap)**
Geolocalização e busca de endereços.

- **Uso:** Autocomplete de endereços, conversão endereço → coordenadas
- **Gratuita e sem cadastro** — ideal para projetos acadêmicos
- **Link oficial:** https://nominatim.openstreetmap.org
- **Documentação:** https://nominatim.org/release-docs/latest/api/Search/
- **Endpoint:** `GET https://nominatim.openstreetmap.org/search?q={endereço}&format=json&limit=5`

### 2. **Overpass API (OpenStreetMap)**
Busca de locais (clínicas, farmácias) próximos ao paciente.

- **Uso:** Encontrar instalações de saúde nas proximidades
- **Livre e gratuita**
- **Link oficial:** https://overpass-api.de
- **Endpoint:** `POST https://overpass-api.de/api/interpreter`

### 3. **ViaCEP**
Consulta de dados de endereço a partir do CEP.

- **Uso:** Preenchimento automático de logradouro, bairro e cidade
- **Gratuita, sem autenticação**
- **Link oficial:** https://viacep.com.br
- **Endpoint:** `GET https://viacep.com.br/ws/{cep}/json/`
- **Compatível com LGPD** — não armazena dados de saúde

**Exemplo de fluxo:**
CEP → ViaCEP (endereço) → Nominatim (coordenadas) → Overpass (lugares próximos)

---

## 📊 Módulos da Aplicação (8 módulos com CRUD completo)

1. **Dashboard** — Visão geral com métricas, agenda do dia e indicadores
2. **Pacientes** — Cadastro, listagem, edição e exclusão de pacientes
3. **Agendamentos** — Criação e gerenciamento de consultas
4. **Prontuários** — Registro e histórico de atendimentos por paciente
5. **Usuários/Equipe** — Gerenciamento de médicos e recepcionistas
6. **Exames** — Solicitação, agendamento e registro de resultados de exames
7. **Especialidades** — Catálogo de especialidades médicas
8. **Convênios/Planos de Saúde** — Gerenciamento de cobertura de saúde dos pacientes

---

## 🧪 Reprodução dos Testes

### Backend (Jest + Supertest)
```bash
cd backend
npm run test                # Executa testes uma vez
npm run test:watch          # Modo watch (desenvolvimento)
npm run test:coverage       # Relatório de cobertura
```

### Frontend (Vitest + React Testing Library)
```bash
cd frontend
npm run test                # Executa testes
npm run test:coverage       # Cobertura de testes
npm run test:ui             # Interface gráfica do Vitest
```

### E2E (Cypress)
```bash
cd frontend
npm run cypress:open        # Modo interativo
npm run cypress:run         # Modo headless (CI)
```

---

## 👥 Equipe

Projeto desenvolvido para a disciplina de **Qualide de Software** — Centro Universitário do Estado do Pará (CESUPA)  
Analice Alves Johnston Pinheiro
Bernardo Lins Bentes
Lucas Augusto Rodrigues

---
