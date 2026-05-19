# 🔗 Guia de Integração Frontend + Backend

**Data:** 19 de Maio de 2026  
**Objetivo:** Conectar React frontend com Node.js backend

---

## ✅ Pré-requisitos

### Backend
- [ ] PostgreSQL instalado e rodando
- [ ] Node.js 18+
- [ ] Arquivo `.env` configurado
- [ ] `npx prisma migrate dev --name init` executado
- [ ] `npm run dev` rodando em `http://localhost:3333`

### Frontend
- [ ] Node.js 18+
- [ ] Arquivo `.env` configurado
- [ ] `npm run dev` rodando em `http://localhost:5173`

---

## 🔐 Fluxo de Autenticação

### 1. Login no Frontend

```
Usuário digita email/senha
        ↓
Frontend: POST /api/auth/login
        ↓
Backend: Valida credenciais
        ↓
Backend: Retorna { token, user }
        ↓
Frontend: Armazena token em localStorage
        ↓
Frontend: Redireciona para /dashboard
```

### 2. Requisições Autenticadas

Todas as requisições devem incluir o header:
```
Authorization: Bearer {token}
```

O frontend (Axios) faz isso automaticamente via interceptador em `src/services/api.ts`.

---

## 🔧 Configuração da Integração

### Frontend - `src/services/api.ts`

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

// Interceptador adiciona token automaticamente
const token = localStorage.getItem('token');
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

// Redireciona para login se token expirou
if (error.response?.status === 401) {
  window.location.href = '/login';
}
```

### Backend - `src/index.ts`

```typescript
// CORS permite requisições do frontend
app.use(cors());

// Todas as rotas protegidas por authMiddleware
router.get('/patients', authMiddleware, patientController.getAll);
```

---

## 📝 Checklist de Integração

### ✅ Backend Pronto?

```bash
cd backend

# 1. Instalar dependências
npm install

# 2. Configurar .env
cat > .env << EOF
DATABASE_URL="postgresql://user:password@localhost:5432/vitalink"
PORT=3333
JWT_SECRET=seu-secret-key
NODE_ENV=development
EOF

# 3. Criar banco de dados
npx prisma migrate dev --name init

# 4. Testar servidor
npm run dev
# Deve retornar: "🚀 Servidor rodando em http://localhost:3333"

# 5. Testar health check
curl http://localhost:3333/health
# Retorna: { "status": "API VitaLink Online" }

# 6. Rodar testes
npm test
# Deve passar todos os testes
```

### ✅ Frontend Pronto?

```bash
cd frontend

# 1. Instalar dependências
npm install

# 2. Configurar .env
cat > .env << EOF
VITE_API_URL=http://localhost:3333/api
VITE_ENV=development
EOF

# 3. Iniciar servidor
npm run dev
# Deve retornar: "VITE v4.x.x ready in x ms"

# 4. Testar em navegador
# Acessa http://localhost:5173
# Deve carregar dashboard com dados mockados

# 5. Rodar testes
npm run test
```

---

## 🧪 Teste de Integração Completa

### 1. Testar Autenticação

```bash
# Terminal 1: Backend rodando
cd backend && npm run dev

# Terminal 2: Testar registro
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Teste",
    "email": "dr.teste@example.com",
    "password": "Senha123",
    "role": "DOCTOR",
    "specialty": "Cardiologia"
  }'

# Retorna:
# {
#   "success": true,
#   "data": {
#     "user": { ... },
#     "token": "eyJhbGc..."
#   }
# }

# Terminal 3: Testar login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dr.teste@example.com",
    "password": "Senha123"
  }'

# Salvar o token da resposta: TOKEN="eyJhbGc..."
```

### 2. Testar Requisição Autenticada

```bash
# Usar o TOKEN do passo anterior
TOKEN="eyJhbGc..."

curl -X GET http://localhost:3333/api/patients \
  -H "Authorization: Bearer $TOKEN"

# Deve retornar lista de pacientes
```

### 3. Testar Frontend

```bash
# Terminal 1: Backend rodando
cd backend && npm run dev

# Terminal 2: Frontend rodando
cd frontend && npm run dev

# Terminal 3: Abrir navegador
# Acessa http://localhost:5173

# Deve ver:
# 1. Dashboard com 3 cards
# 2. Clicar em "Pacientes"
# 3. Deve listar pacientes (mockados por enquanto)
# 4. Funcionalidade de busca
# 5. Criar novo paciente
# 6. Editar paciente
# 7. Deletar paciente
```

---

## 🚨 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

```bash
cd backend
npm install
npx prisma generate
```

### Erro: "connect ECONNREFUSED 127.0.0.1:5432"

PostgreSQL não está rodando.

**Windows (com WSL):**
```bash
# Iniciar PostgreSQL
sudo service postgresql start

# Verificar status
sudo service postgresql status
```

**Mac (com Homebrew):**
```bash
brew services start postgresql
```

**Verificar conexão:**
```bash
psql -U postgres -h localhost
# Se conectar, sair com: \q
```

### Erro: "SyntaxError: Unexpected token :"

JSON inválido na requisição. Verificar:
- Content-Type: application/json
- JSON válido no body

### Erro: "Unauthorized" (401)

Token ausente ou expirado.

**Solução:**
```javascript
// Frontend: Fazer login novamente
const response = await api.post('/auth/login', {
  email: 'usuario@example.com',
  password: 'Senha123'
});

const { token } = response.data.data;
localStorage.setItem('token', token);
```

### Frontend mostra dados mockados

Backend não está rodando ou URL está incorreta.

**Verificar:**
1. Backend rodando em http://localhost:3333?
   ```bash
   curl http://localhost:3333/health
   ```

2. URL configurada em `.env`?
   ```bash
   cat frontend/.env | grep VITE_API_URL
   # Deve retornar: VITE_API_URL=http://localhost:3333/api
   ```

3. Reiniciar frontend:
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📊 Fluxo de Dados

### Criar Paciente

```
Frontend (Form)
    ↓ (POST /api/patients)
Backend (Controller)
    ↓ (Valida dados)
Backend (Service)
    ↓ (Lógica de negócio)
Backend (Repository)
    ↓ (Prisma)
PostgreSQL
    ↓ (INSERT)
Backend (Response)
    ↓ (JSON com novo paciente)
Frontend (Atualiza lista)
```

### Listar Pacientes

```
Frontend (onClick)
    ↓ (GET /api/patients?page=1&limit=10)
Backend (Controller)
    ↓ (Extrai paginação)
Backend (Service)
    ↓ (Chamada ao repositório)
Backend (Repository)
    ↓ (Prisma query)
PostgreSQL
    ↓ (SELECT + COUNT)
Backend (Response)
    ↓ (JSON com dados + paginação)
Frontend (Renderiza tabela)
```

### Criar Agendamento

```
Frontend (Form)
    ↓ (POST /api/appointments)
Backend (Valida paciente + médico)
    ↓
Backend (Verifica conflitos)
    ↓ (Nenhuma consulta no horário?)
Backend (Cria agendamento)
    ↓
Backend (Response com sucesso)
Frontend (Redireciona para lista)
```

---

## 🔄 Atualizações em Tempo Real

Atualmente, **não há WebSockets**. Para atualizar dados em tempo real:

### Opção 1: Polling (Atual)
```javascript
// A cada 30 segundos
setInterval(() => {
  fetchPatients();
}, 30000);
```

### Opção 2: WebSocket (Futura)
```javascript
const socket = io('http://localhost:3333');
socket.on('patients:updated', () => {
  fetchPatients();
});
```

### Opção 3: Server-Sent Events (Futura)
```javascript
const eventSource = new EventSource('/api/patients/stream');
eventSource.onmessage = (event) => {
  fetchPatients();
};
```

---

## 📈 Performance

### Otimizações Implementadas

✅ **Frontend:**
- Code splitting com React.lazy
- Memoização de componentes
- Debounce em buscas

✅ **Backend:**
- Índices no banco (email, cpf)
- Paginação obrigatória
- Select específicos (não trazer password)
- Connection pooling via Prisma

### Monitorar Performance

**Frontend:**
```javascript
// Chrome DevTools > Performance tab
// Ou usar Lighthouse
```

**Backend:**
```bash
# Ver logs de requisições
npm run dev
# Mostra: [GET] /api/patients - 200 (45ms)
```

---

## 🚀 Deploy (Futuro)

### Frontend (Vercel)
```bash
# 1. Fazer build
npm run build

# 2. Fazer deploy
vercel --prod
```

### Backend (Heroku/Railway)
```bash
# 1. Criar arquivo Procfile
echo "web: npm start" > Procfile

# 2. Fazer deploy
heroku create app-name
git push heroku main
```

---

## 📋 Resumo

| Item | Status | Comando |
|------|--------|---------|
| Backend instalado | ✅ | `cd backend && npm install` |
| Banco configurado | ✅ | `npx prisma migrate dev` |
| Backend rodando | ✅ | `npm run dev` (porta 3333) |
| Frontend instalado | ✅ | `cd frontend && npm install` |
| Frontend rodando | ✅ | `npm run dev` (porta 5173) |
| Autenticação | ✅ | POST /api/auth/login |
| CRUD Pacientes | ✅ | GET/POST/PUT/DELETE /api/patients |
| CRUD Agendamentos | ✅ | GET/POST/PUT/PATCH /api/appointments |
| Testes backend | ✅ | `npm run test` |
| Testes frontend | ✅ | `npm run test` |

---

**Desenvolvido com ❤️ para VitaLink**
