# 🏥 VitaLink — Plataforma de Gestão em Saúde

> Plataforma web completa para gerenciamento de consultas, pacientes, prontuários e monitoramento de saúde.

---

## 📋 Descrição do Projeto

O **VitaLink** é uma plataforma web voltada para clínicas e consultórios médicos de pequeno e médio porte, permitindo o gerenciamento digital de pacientes, agendamentos, prontuários eletrônicos e monitoramento de indicadores de saúde. A plataforma integra uma API externa de geolocalização para localizar clínicas e farmácias próximas ao paciente.

---

## 🧑‍💻 Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Front-end | React + TypeScript | Ecossistema maduro, tipagem estática, componentes reutilizáveis |
| Estilização | Tailwind CSS | Alta produtividade, design responsivo sem CSS manual |
| Back-end | Node.js + Express | JavaScript full-stack, baixa curva de aprendizado da equipe |
| Banco de Dados | PostgreSQL | Dados relacionais com integridade referencial (pacientes, consultas, prontuários) |
| ORM | Prisma | Type-safe, migrations automatizadas, excelente DX |
| API Externa | OpenStreetMap / Nominatim | Geolocalização gratuita para localizar clínicas e farmácias próximas |
| Autenticação | JWT + bcrypt | Padrão seguro para sessões stateless |
| Testes | Jest + Supertest + Cypress | Cobertura unitária, integração e E2E |
| Qualidade | SonarCloud | Análise estática: complexidade, duplicação, vulnerabilidades |
| Versionamento | Git + GitHub | Padrão da indústria, CI/CD via GitHub Actions |

---

## 🗂️ Estrutura do Repositório

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

## ⚙️ Instruções de Instalação

### Pré-requisitos

- Node.js >= 18.x
- PostgreSQL >= 15.x
- npm >= 9.x

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/vitalink.git
cd vitalink
```

### 2. Configurar o Back-end

```bash
cd backend
cp .env.example .env
# Editar .env com as credenciais do banco e JWT_SECRET
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### 3. Configurar o Front-end

```bash
cd frontend
cp .env.example .env
# Editar .env com a URL da API
npm install
npm run dev
```

### 4. Acessar a aplicação

- Front-end: http://localhost:5173  
- API: http://localhost:3333  
- Documentação Swagger: http://localhost:3333/api-docs

---

## 🌐 API Externa — OpenStreetMap / Nominatim

A integração com a API **Nominatim** (OpenStreetMap) foi escolhida por ser:

- **Gratuita e sem necessidade de cadastro** — ideal para projeto acadêmico
- **Confiável e com boa cobertura** do Brasil
- **Compatível com LGPD** — não envia dados de saúde para terceiros

**Uso:** Ao cadastrar o endereço de um paciente ou clínica, o sistema realiza geocodificação para exibir localização em mapa e sugerir farmácias e clínicas próximas.

Endpoint utilizado:
```
GET https://nominatim.openstreetmap.org/search?q={endereço}&format=json&limit=5
```

---

## 📊 Telas da Aplicação (5 telas com CRUD completo)

1. **Dashboard** — Visão geral com métricas e agenda do dia
2. **Pacientes** — Cadastro, listagem, edição e exclusão de pacientes
3. **Agendamentos** — Criação e gerenciamento de consultas
4. **Prontuários** — Registro e histórico de atendimentos por paciente
5. **Usuários/Equipe** — Gerenciamento de médicos e recepcionistas

---

## 🧪 Reprodução dos Testes

```bash
# Testes unitários e integração (back-end)
cd backend
npm run test
npm run test:coverage

# Testes E2E (front-end)
cd frontend
npm run cypress:open   # modo interativo
npm run cypress:run    # modo headless (CI)
```

---

## 👥 Equipe

Projeto desenvolvido para a disciplina de **Desenvolvimento Web** — Centro Universitário do Estado do Pará (CESUPA)  
Curso de Engenharia de Computação

---

## 📄 Licença

MIT
