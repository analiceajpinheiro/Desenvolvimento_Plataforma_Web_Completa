# Decisões Técnicas — VitaLink

## 1. Arquitetura Geral

**Decisão**: Separação em dois projetos independentes — `backend/` (API REST) e `frontend/` (SPA React).

**Justificativa**: Permite escalar, deployar e testar cada camada de forma independente. O frontend consome a API via HTTP (proxy Vite em dev, nginx em prod), eliminando acoplamento de runtime.

**Padrão adotado no backend**: Controller → Service → Repository
- **Controller**: recebe HTTP, valida entrada superficial, delega ao Service
- **Service**: orquestra regras de negócio, coordena chamadas ao Repository
- **Repository**: único responsável por acesso ao banco via Prisma

## 2. Stack Tecnológica

### Backend
| Tecnologia | Versão | Razão |
|---|---|---|
| Node.js + Express | 18 LTS | Maturidade, ecossistema npm, tipagem via TypeScript |
| TypeScript | 5.x | Type-safety em models e contratos de API |
| Prisma ORM | 5.x | Migrations versionadas, type-safe queries, suporte PostgreSQL |
| PostgreSQL | 15 | ACID, suporte a JSON, confiabilidade para dados clínicos |
| JWT (jsonwebtoken) | — | Autenticação stateless; payload inclui `id`, `email`, `role` |
| bcrypt | — | Hashing de senhas com salt; nunca armazenadas em texto claro |
| Jest + ts-jest | 29 | Framework de testes padrão Node; suporte nativo a TypeScript |
| Supertest | — | Testes de integração HTTP sem subir servidor real |

### Frontend
| Tecnologia | Versão | Razão |
|---|---|---|
| React | 18.x | Componentização, hooks, ecossistema amplo |
| TypeScript | 5.x | Contratos de tipos compartilhados com o backend |
| Vite | 5.x | Build ultrarrápido com HMR; proxy de API integrado em dev |
| React Router DOM | 6.x | Roteamento client-side com suporte a nested routes |
| Axios | 1.x | Cliente HTTP com interceptors para JWT e tratamento de erros |
| Tailwind CSS | 3.x | Utility-first; elimina conflitos de escopo de CSS |
| Vitest | 4.x | Runner de testes compatível com Vite; mesma config de transform |
| @testing-library/react | 14.x | Testes orientados ao comportamento do usuário |
| Cypress | 13.x | E2E em browser real; suporta custom commands (login) |

## 3. Autenticação e Segurança

**JWT com expiração de 24h**: tokens gerados no login, enviados no header `Authorization: Bearer <token>`. O middleware `authMiddleware` valida assinatura e expiração antes de qualquer rota protegida.

**RBAC (Role-Based Access Control)**: três papéis — `DOCTOR`, `RECEPTIONIST`, `ADMIN`. O middleware `roleMiddleware` verifica o `role` extraído do JWT.

**Senhas**: nunca armazenadas em texto claro. Utilizamos `bcrypt` com fator de custo padrão (10 rounds).

**CORS**: configurado para aceitar apenas origens específicas em produção.

**Variáveis sensíveis**: `JWT_SECRET`, `DATABASE_URL` e demais credenciais via `.env` (nunca commitadas; `.gitignore` garante exclusão).

## 4. Estratégia de Testes — 3 Níveis

### Nível 1 — Unitários (Jest / Vitest)
- **Backend**: testam Services e Repositories isoladamente via mocks do Prisma e de dependências externas (axios)
- **Frontend**: testam hooks customizados (`useUsers`, `useExams`, `useSpecialties`, `useHealthPlans`) via `renderHook` + `act`
- **Cobertura mínima exigida**: 70% (statements, branches, functions, lines) — configurado em `jest.config.js` e verificado em CI

### Nível 2 — Integração (Supertest)
- Testam a camada HTTP completa: roteamento → middleware → controller → service (mockado)
- Verificam status codes, shape dos responses e comportamento de auth/RBAC
- Arquivo principal: `backend/tests/integration/api.test.ts`

### Nível 3 — E2E (Cypress)
- Executam fluxos reais em browser contra a aplicação rodando localmente
- Cobrem: login, cadastro de pacientes, prontuários, prescrições, exames, especialidades, convênios, dashboard
- Custom command `cy.login()` centraliza autenticação para reúso nos specs
- Configuração: `frontend/cypress/e2e/`

## 5. APIs Externas Integradas

### ViaCEP
- **Endpoint**: `https://viacep.com.br/ws/{cep}/json/`
- **Uso**: autopreenchimento de endereço no cadastro de pacientes a partir do CEP
- **Fallback**: se a API retornar erro ou CEP inválido, o form continua editável sem autopreenchimento

### Nominatim (OpenStreetMap)
- **Endpoint**: `https://nominatim.openstreetmap.org/search`
- **Uso**: geocodificação reversa — converte endereço textual em coordenadas (lat/lon)
- **Política**: User-Agent obrigatório; rate limit respeitado (1 req/s)

### Overpass API
- **Endpoint**: `https://overpass-api.de/api/interpreter`
- **Uso**: busca de clínicas e hospitais próximos ao endereço do paciente (raio configurável)
- **Query**: QL Overpass filtrando `amenity=clinic` e `amenity=hospital`

## 6. Qualidade de Código e CI/CD

### SonarCloud
- Análise estática de código executada em cada push para `main`
- Configuração: `sonar-project.properties`
- Relatórios de cobertura LCOV enviados: `backend/coverage/lcov.info` e `frontend/coverage/lcov.info`
- Quality Gate: bloqueia merge se cobertura ou duplicação estiver fora do threshold

### GitHub Actions (`.github/workflows/`)
- **ci.yml**: instala dependências, executa `npm run test:coverage` (backend e frontend), gera relatórios de cobertura, aciona análise SonarCloud
- Executado em push e pull requests para `main`

### Estratégia de branches
- `main`: branch de produção; todos os merges passam por CI
- Feature branches nomeadas por sprint/funcionalidade

## 7. Banco de Dados e Migrations

**Prisma Migrate**: cada alteração de schema gera um arquivo de migration versionado em `backend/prisma/migrations/`. Isso garante rastreabilidade e rollback controlado.

**Seed**: `backend/prisma/seed.ts` popula dados iniciais (admin, especialidades padrão) para facilitar onboarding local e testes E2E.

**Soft delete**: entidades como `Specialty` utilizam flag `isActive` em vez de deleção física, preservando integridade referencial e histórico clínico.
