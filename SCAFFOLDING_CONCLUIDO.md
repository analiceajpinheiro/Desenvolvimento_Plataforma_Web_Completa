# ✅ Scaffolding Completo — Sprint 2

## 📦 O que foi criado

### **1. Estrutura de Diretórios**

```
vitalink/
├── frontend/     (React + Vite + TypeScript + Tailwind)
├── backend/      (Express + Node.js + TypeScript + Prisma)
├── docs/         (Documentação)
└── [arquivos de config]
```

### **2. Arquivo Prisma Schema**
- ✅ Modelos de dados: User, Patient, Appointment, MedicalRecord, Prescription
- ✅ Enums: Role, AppointmentStatus
- ✅ Relacionamentos entre entidades

### **3. Package.json (Dependências)**

**Backend:**
- Express, Prisma, bcrypt, JWT, Jest, Supertest, TypeScript

**Frontend:**
- React, React Router, Vite, Cypress, Tailwind CSS, TypeScript, Vitest

### **4. Arquivos de Configuração**

- ✅ `tsconfig.json` (ambos)
- ✅ `jest.config.js` (backend)
- ✅ `vite.config.ts` (frontend)
- ✅ `.prettierrc` (formatação de código)
- ✅ `.gitignore`

### **5. Arquivos Iniciais**

**Backend:**
- `src/index.ts` (servidor Express)
- `src/types/index.ts` (interfaces TypeScript)
- Exemplos em: controllers/, services/, repositories/, tests/

**Frontend:**
- `src/App.tsx` (componente raiz)
- `src/main.tsx` (ponto de entrada)
- `src/index.css` (estilos base)
- `src/App.css`
- `index.html` (HTML principal)
- Exemplo em: `cypress/e2e/EXEMPLO.cy.ts`

### **6. Documentação**

- ✅ `docs/SPRINT_2.md` (guia detalhado de desenvolvimento)
- ✅ `docs/casos-de-uso.md` (15 casos de uso copiados)
- ✅ `.env.example` (ambos) - credenciais de exemplo

### **7. Exemplos de Código**

Arquivos EXEMPLO em:
- `backend/src/controllers/EXEMPLO.ts`
- `backend/src/services/EXEMPLO.ts`
- `backend/src/repositories/EXEMPLO.ts`
- `backend/tests/EXEMPLO.test.ts`
- `frontend/cypress/e2e/EXEMPLO.cy.ts`

---

## 🚀 Próximos Passos para sua Equipe

### **1. Setup Inicial**

```bash
# Backend
cd backend
npm install
cp .env.example .env
# [editar .env com PostgreSQL]
npx prisma migrate dev --name init

# Frontend
cd frontend
npm install
cp .env.example .env
```

### **2. Começar a Desenvolver**

Siga o guia em `docs/SPRINT_2.md` que contém:
- Tarefas por fase (Autenticação → Pacientes → Agendamentos → Prontuários → Dashboard)
- Exemplos de estrutura para Controllers, Services, Repositories
- Como estruturar testes
- Workflow com Git

### **3. Divisão de Trabalho Sugerida**

**Colega 1 (Backend - Fase 1)**
- Implementar autenticação (UC08, UC09, UC13)
- JWT, bcrypt, middleware
- Testes unitários

**Colega 2 (Frontend - Fase 1)**
- Páginas de Login, Redefinir Senha
- Gerenciamento de autenticação
- Proteção de rotas

**Colega 3 (Integração - Fase 2)**
- Pacientes (UC01, UC02, UC03)
- API Nominatim
- Testes E2E

---

## 📋 Checklist para Iniciar

- [ ] Clonar o repositório
- [ ] Instalar Node.js >= 18.x
- [ ] Instalar PostgreSQL
- [ ] Rodar `npm install` em backend/
- [ ] Rodar `npm install` em frontend/
- [ ] Copiar `.env.example` → `.env` em ambas pastas
- [ ] Editar `.env` com credenciais reais
- [ ] Rodar `npx prisma migrate dev` no backend
- [ ] Rodar `npm run dev` em ambas pastas
- [ ] Acessar http://localhost:3333/health (deve retornar JSON)
- [ ] Acessar http://localhost:5173 (deve mostrar React)

---

## 📚 Documentação Rápida

| Pasta/Arquivo | Conteúdo |
|---|---|
| `backend/src/controllers/` | Endpoints HTTP |
| `backend/src/services/` | Lógica de negócio |
| `backend/src/repositories/` | Acesso ao BD (Prisma) |
| `backend/tests/` | Testes unitários |
| `frontend/src/pages/` | Telas da aplicação |
| `frontend/src/components/` | Componentes React reutilizáveis |
| `frontend/cypress/e2e/` | Testes end-to-end |
| `docs/` | Documentação do projeto |

---

## 💡 Dicas Importantes

1. **Use os EXEMPLOS:** Os arquivos EXEMPLO.* mostram a estrutura esperada
2. **Siga o padrão:** Controllers → Services → Repositories
3. **Teste sempre:** Cada funcionalidade deve ter testes
4. **Commit frequente:** Evita conflitos e facilita colaboração
5. **Leia SPRINT_2.md:** Contém o roadmap completo

---

## ❓ Dúvidas?

1. Consulte `docs/SPRINT_2.md`
2. Revise `docs/casos-de-uso.md`
3. Veja os arquivos EXEMPLO nas respectivas pastas

**Bom desenvolvimento! 🚀**
