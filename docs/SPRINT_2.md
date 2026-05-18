# 📋 Guia para Sprint 2 — Desenvolvimento

Este documento fornece um roteiro claro para que você e seus colegas continuem o desenvolvimento de forma organizada.

---

## 📦 Estrutura do Projeto

```
vitalink/
├── frontend/                  # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Telas da aplicação
│   │   ├── services/          # Chamadas à API
│   │   ├── hooks/             # Custom hooks
│   │   ├── types/             # Tipos TypeScript
│   │   ├── utils/             # Funções utilitárias
│   │   ├── App.tsx            # Componente raiz
│   │   └── main.tsx           # Ponto de entrada
│   ├── cypress/               # Testes E2E
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── backend/                   # Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── controllers/       # Lógica dos endpoints
│   │   ├── services/          # Regras de negócio
│   │   ├── repositories/      # Acesso ao banco (Prisma)
│   │   ├── middlewares/       # Auth, validação, erro
│   │   ├── routes/            # Definição de rotas
│   │   ├── types/             # Interfaces TypeScript
│   │   ├── utils/             # Funções utilitárias
│   │   └── index.ts           # Ponto de entrada
│   ├── prisma/
│   │   ├── schema.prisma      # Modelo do banco
│   │   └── migrations/        # Histórico de migrations (auto-gerado)
│   ├── tests/                 # Testes unitários e integração
│   ├── jest.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── docs/                      # Documentação
│   ├── casos-de-uso.md
│   ├── casos-de-teste.md
│   └── SPRINT_2.md (este arquivo)
│
└── README.md
```

---

## 🚀 Como Começar (Próximos Passos)

### 1️⃣ **Backend Setup**

```bash
cd backend
npm install
cp .env.example .env
# Edite .env com suas credenciais PostgreSQL
npx prisma migrate dev --name init
npm run dev
```

**Verificar:** Acesse http://localhost:3333/health

### 2️⃣ **Frontend Setup**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

**Verificar:** Acesse http://localhost:5173

---

## 📋 Tarefas Sugeridas por Fase

### **FASE 1: Autenticação (UC08, UC09, UC13)**

**Backend:**
- [ ] Controller de Auth (login, logout, refresh token)
- [ ] Service de Auth (validação de credenciais, geração de JWT)
- [ ] Middleware de autenticação
- [ ] Repository de User (CRUD básico)

**Frontend:**
- [ ] Página de Login
- [ ] Página de Redefinir Senha
- [ ] Hook para gerenciar autenticação
- [ ] Proteção de rotas (Private Routes)

---

### **FASE 2: Gerenciamento de Pacientes (UC01, UC02, UC03, UC07, UC10)**

**Backend:**
- [ ] Controller de Pacientes (CRUD)
- [ ] Service de Pacientes
- [ ] Repository de Pacientes
- [ ] Integração com API Nominatim (geolocalização)
- [ ] Testes unitários (Jest)

**Frontend:**
- [ ] Página de Listagem de Pacientes
- [ ] Página de Cadastro de Paciente
- [ ] Página de Edição de Paciente
- [ ] Componente de Mapa (clínicas próximas)
- [ ] Testes E2E (Cypress)

---

### **FASE 3: Agendamentos (UC04, UC05)**

**Backend:**
- [ ] Controller de Agendamentos (CRUD)
- [ ] Service de Agendamentos (validação de disponibilidade)
- [ ] Repository de Agendamentos
- [ ] Testes de integração (Supertest)

**Frontend:**
- [ ] Página de Agendamentos
- [ ] Formulário de Nova Consulta
- [ ] Validação de disponibilidade em tempo real

---

### **FASE 4: Prontuários (UC06, UC11, UC15)**

**Backend:**
- [ ] Controller de Prontuários
- [ ] Service de Prontuários
- [ ] Controller de Prescrições
- [ ] Testes end-to-end

**Frontend:**
- [ ] Página de Prontuário (formulário)
- [ ] Página de Histórico do Paciente
- [ ] Componente de Prescrição

---

### **FASE 5: Dashboard (UC12, UC14)**

**Backend:**
- [ ] Endpoint de Relatórios
- [ ] Agregação de métricas

**Frontend:**
- [ ] Dashboard com métricas
- [ ] Gráficos (exemplo: Chart.js)
- [ ] Exportação de relatórios

---

## 🧪 Testes — Estrutura Base

### **Backend (Jest)**

```bash
cd backend
npm run test              # Executa testes
npm run test:watch       # Modo watch
npm run test:coverage    # Cobertura
```

**Exemplo de teste unitário:**
```typescript
// tests/services/AuthService.test.ts
describe('AuthService', () => {
  it('deve validar email e senha', () => {
    // seu teste aqui
  });
});
```

### **Frontend (Cypress)**

```bash
cd frontend
npm run cypress:open      # Interface gráfica
npm run cypress:run       # Modo headless (CI)
```

**Exemplo de teste E2E:**
```typescript
// cypress/e2e/login.cy.ts
describe('Login', () => {
  it('deve fazer login com credenciais válidas', () => {
    cy.visit('/login');
    cy.get('[data-cy=email]').type('user@example.com');
    cy.get('[data-cy=password]').type('password');
    cy.get('[data-cy=submit]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

---

## 📝 Documentação de Casos de Teste

Para cada caso de uso implementado, crie um arquivo em `docs/casos-de-teste.md`:

```markdown
## CT01 — Fazer Login

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar autenticação de usuário |
| **Pré-condições** | Usuário cadastrado no sistema |
| **Passos** | 1. Acessar /login <br> 2. Preencher email e senha <br> 3. Clicar em "Entrar" |
| **Resultado Esperado** | Redirecionado para /dashboard com token JWT armazenado |
| **Resultado Obtido** | ✅ Passou |
| **Status** | APROVADO |
```

---

## 🔄 Workflow de Desenvolvimento

1. **Clone e crie uma branch:**
   ```bash
   git checkout -b feat/autenticacao
   ```

2. **Desenvolva sua funcionalidade**
   - Crie componentes/controllers/services
   - Adicione testes
   - Valide com `npm run test`

3. **Commit com mensagens claras:**
   ```bash
   git commit -m "feat: implementar login de usuários"
   ```

4. **Push e abra um Pull Request:**
   ```bash
   git push origin feat/autenticacao
   ```

---

## 🛠️ Ferramentas Disponíveis

| Ferramenta | Comando | Uso |
|-----------|---------|-----|
| **Prisma Studio** | `npm run prisma:studio` (backend) | Visualizar/editar dados do BD |
| **Swagger** | http://localhost:3333/api-docs | Documentação de API |
| **Coverage** | `npm run test:coverage` | Relatório de cobertura |
| **TypeScript** | Já configurado | Digitação estática |

---

## 📚 Recursos Úteis

- [Prisma Docs](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Hooks](https://react.dev/reference/react/hooks)
- [Cypress E2E Testing](https://docs.cypress.io/)
- [Jest Testing](https://jestjs.io/)

---

## ❓ Dúvidas?

Consulte o **README.md** principal ou revise os **casos de uso** em `docs/casos-de-uso.md`.

Bom trabalho! 🚀
