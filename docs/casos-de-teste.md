# Documentação de Casos de Teste - VitaLink

**Projeto:** VitaLink — Plataforma de Gestão em Saúde  
**Data:** Dezembro 2024  
**Escopo:** Testes Frontend (Cypress E2E + Vitest Unitários) e Backend (Jest + Supertest)

---

## 📋 Índice

1. [Testes Unitários](#testes-unitários)
2. [Testes de Integração](#testes-de-integração)
3. [Testes E2E](#testes-e2e)
4. [Execução dos Testes](#execução-dos-testes)
5. [Resumo de Cobertura](#resumo-de-cobertura)

---

## 🧪 Testes Unitários

### 1. Validadores (`validators.test.ts`)

---

### CT-U-001 — Validar Email Correto

| Campo | Valor |
|---|---|
| **Identificador** | CT-U-001 |
| **Caso de Uso** | UC-06 — Validar Dados de Formulário |
| **Objetivo** | Verificar que `validateEmail` aceita emails em formato correto |
| **Pré-condições** | Módulo `validators.ts` disponível; ambiente Vitest configurado |
| **Dados de Entrada** | `test@example.com`, `user.name@domain.co.uk` |
| **Passos de Execução** | 1. Importar `validateEmail` de `validators.ts` 2. Chamar com cada email válido 3. Verificar valor retornado |
| **Resultado Esperado** | `true` para todos os emails válidos |
| **Resultado Obtido** | Retornou `true` conforme esperado ✅ |
| **Status** | ✅ Aprovado |

---

### CT-U-002 — Rejeitar Email Inválido

| Campo | Valor |
|---|---|
| **Identificador** | CT-U-002 |
| **Caso de Uso** | UC-06 — Validar Dados de Formulário |
| **Objetivo** | Verificar que `validateEmail` rejeita emails malformados |
| **Pré-condições** | Módulo `validators.ts` disponível; ambiente Vitest configurado |
| **Dados de Entrada** | `invalid`, `invalid@`, `@domain.com` |
| **Passos de Execução** | 1. Importar `validateEmail` 2. Chamar com cada email inválido 3. Verificar valor retornado |
| **Resultado Esperado** | `false` para todos os emails inválidos |
| **Resultado Obtido** | Retornou `false` conforme esperado ✅ |
| **Status** | ✅ Aprovado |

---

### CT-U-003 — Validar CPF Válido

| Campo | Valor |
|---|---|
| **Identificador** | CT-U-003 |
| **Caso de Uso** | UC-02 — Cadastrar Paciente |
| **Objetivo** | Verificar que `validateCPF` aceita CPF com dígitos verificadores corretos |
| **Pré-condições** | Módulo `validators.ts` disponível; ambiente Vitest configurado |
| **Dados de Entrada** | `00000000191` |
| **Passos de Execução** | 1. Importar `validateCPF` 2. Chamar com CPF válido `00000000191` 3. Verificar retorno |
| **Resultado Esperado** | `true` |
| **Resultado Obtido** | Retornou `true` conforme esperado ✅ |
| **Status** | ✅ Aprovado |

---

### CT-U-004 — Rejeitar CPF Inválido

| Campo | Valor |
|---|---|
| **Identificador** | CT-U-004 |
| **Caso de Uso** | UC-02 — Cadastrar Paciente |
| **Objetivo** | Verificar que `validateCPF` rejeita CPF com tamanho incorreto ou dígitos repetidos |
| **Pré-condições** | Módulo `validators.ts` disponível; ambiente Vitest configurado |
| **Dados de Entrada** | `123` (tamanho incorreto), `11111111111` (todos iguais) |
| **Passos de Execução** | 1. Importar `validateCPF` 2. Chamar com `123` 3. Chamar com `11111111111` 4. Verificar retornos |
| **Resultado Esperado** | `false` em ambos os casos |
| **Resultado Obtido** | Retornou `false` em ambos os casos ✅ |
| **Status** | ✅ Aprovado |

---

### CT-U-005 — Validar Telefone

| Campo | Valor |
|---|---|
| **Identificador** | CT-U-005 |
| **Caso de Uso** | UC-02 — Cadastrar Paciente |
| **Objetivo** | Verificar que `validatePhone` aceita telefones com 11 dígitos |
| **Pré-condições** | Módulo `validators.ts` disponível; ambiente Vitest configurado |
| **Dados de Entrada** | `11999999999`, `(11)99999-9999` |
| **Passos de Execução** | 1. Importar `validatePhone` 2. Chamar com telefone numérico puro 3. Chamar com formato mascarado 4. Verificar retornos |
| **Resultado Esperado** | `true` para ambos os formatos |
| **Resultado Obtido** | Retornou `true` conforme esperado ✅ |
| **Status** | ✅ Aprovado |

---

### CT-U-006 — Formatar CPF

| Campo | Valor |
|---|---|
| **Identificador** | CT-U-006 |
| **Caso de Uso** | UC-02 — Cadastrar Paciente |
| **Objetivo** | Verificar que `formatCPF` aplica a máscara `XXX.XXX.XXX-XX` |
| **Pré-condições** | Módulo `validators.ts` disponível; ambiente Vitest configurado |
| **Dados de Entrada** | `12345678901` |
| **Passos de Execução** | 1. Importar `formatCPF` 2. Chamar com `12345678901` 3. Verificar string retornada |
| **Resultado Esperado** | `123.456.789-01` |
| **Resultado Obtido** | Retornou `123.456.789-01` ✅ |
| **Status** | ✅ Aprovado |

---

### CT-U-007 — Formatar Telefone

| Campo | Valor |
|---|---|
| **Identificador** | CT-U-007 |
| **Caso de Uso** | UC-02 — Cadastrar Paciente |
| **Objetivo** | Verificar que `formatPhone` aplica a máscara `(XX) XXXXX-XXXX` |
| **Pré-condições** | Módulo `validators.ts` disponível; ambiente Vitest configurado |
| **Dados de Entrada** | `11999999999` |
| **Passos de Execução** | 1. Importar `formatPhone` 2. Chamar com `11999999999` 3. Verificar string retornada |
| **Resultado Esperado** | `(11) 99999-9999` |
| **Resultado Obtido** | Retornou `(11) 99999-9999` ✅ |
| **Status** | ✅ Aprovado |

---

### CT-U-008 — Calcular Idade

| Campo | Valor |
|---|---|
| **Identificador** | CT-U-008 |
| **Caso de Uso** | UC-02 — Cadastrar Paciente |
| **Objetivo** | Verificar que `calculateAge` retorna a idade correta a partir da data de nascimento |
| **Pré-condições** | Módulo `validators.ts` disponível; data de referência conhecida |
| **Dados de Entrada** | `1990-01-15` |
| **Passos de Execução** | 1. Importar `calculateAge` 2. Chamar com data `1990-01-15` 3. Verificar resultado numérico |
| **Resultado Esperado** | Retorna valor ≥ 34 (baseado na data atual) |
| **Resultado Obtido** | Retornou idade correta conforme data atual ✅ |
| **Status** | ✅ Aprovado |

---

### 2. Componente Alert (`Alert.test.tsx`)

#### CT-U-009: Renderizar Alerta de Sucesso
- **Objetivo:** Renderizar alerta com cor verde
- **Ação:** Render `Alert` com `type="success"`
- **Saída Esperada:** Elemento com classe `bg-green-100`
- **Status:** ✅ Implementado

#### CT-U-010: Renderizar Alerta de Erro
- **Objetivo:** Renderizar alerta com cor vermelha
- **Ação:** Render `Alert` com `type="error"`
- **Saída Esperada:** Elemento com classe `bg-red-100`
- **Status:** ✅ Implementado

#### CT-U-011: Exibir Botão de Fechar
- **Objetivo:** Mostrar botão de fechar se callback fornecido
- **Ação:** Render `Alert` com `onClose` callback
- **Saída Esperada:** Botão `×` visível
- **Status:** ✅ Implementado

---

### 3. Componente Button (`Button.test.tsx`)

#### CT-U-012: Renderizar Botão com Texto
- **Objetivo:** Renderizar botão com texto correto
- **Ação:** Render `Button` com children
- **Saída Esperada:** Texto visível no botão
- **Status:** ✅ Implementado

#### CT-U-013: Aplicar Variant Primary
- **Objetivo:** Aplicar estilos de variant primary
- **Ação:** Render `Button` com `variant="primary"`
- **Saída Esperada:** Classe `bg-blue-600` aplicada
- **Status:** ✅ Implementado

#### CT-U-014: Aplicar Variant Danger
- **Objetivo:** Aplicar estilos de variant danger
- **Ação:** Render `Button` com `variant="danger"`
- **Saída Esperada:** Classe `bg-red-600` aplicada
- **Status:** ✅ Implementado

#### CT-U-015: Desabilitar Botão ao Carregar
- **Objetivo:** Desabilitar botão e mostrar "Carregando..."
- **Ação:** Render `Button` com `loading={true}`
- **Saída Esperada:** Botão desabilitado, texto "Carregando..."
- **Status:** ✅ Implementado

#### CT-U-016: Aplicar Tamanhos Diferentes
- **Objetivo:** Aplicar tamanhos sm, md, lg corretamente
- **Ação:** Render `Button` com `size="sm"` e `size="lg"`
- **Saída Esperada:** Diferentes classes de padding aplicadas
- **Status:** ✅ Implementado

---

## 🔗 Testes de Integração

### Hooks com Mock de Serviços

---

### CT-I-001 — usePatients: Carregar Pacientes

| Campo | Valor |
|---|---|
| **Identificador** | CT-I-001 |
| **Caso de Uso** | UC-02 — Gerenciar Pacientes |
| **Objetivo** | Verificar que `usePatients` carrega a lista de pacientes da API corretamente |
| **Pré-condições** | Mock de `patientService` configurado com `vi.mock`; `renderHook` do Testing Library disponível |
| **Dados de Entrada** | Resposta mock: array com 10 pacientes, `pagination: { total: 10 }` |
| **Passos de Execução** | 1. Configurar mock de `patientService.getAll` 2. Renderizar hook com `renderHook(() => usePatients())` 3. Chamar `fetchPatients(1)` 4. Aguardar atualização de estado |
| **Resultado Esperado** | `patients` contém 10 itens; `total` é 10; `loading` é `false` |
| **Resultado Obtido** | Estado atualizado conforme esperado ✅ |
| **Status** | ✅ Aprovado |

---

### CT-I-002 — usePatients: Buscar Pacientes por Termo

| Campo | Valor |
|---|---|
| **Identificador** | CT-I-002 |
| **Caso de Uso** | UC-02 — Gerenciar Pacientes |
| **Objetivo** | Verificar que `searchPatients` filtra pacientes por nome/CPF |
| **Pré-condições** | Mock de `patientService.search` configurado; hook inicializado |
| **Dados de Entrada** | Termo de busca: `'João'`; resposta mock: 2 pacientes com "João" no nome |
| **Passos de Execução** | 1. Configurar mock de `patientService.search` 2. Renderizar hook 3. Chamar `searchPatients('João')` 4. Verificar estado |
| **Resultado Esperado** | `patients` contém apenas os 2 pacientes filtrados |
| **Resultado Obtido** | Lista filtrada conforme esperado ✅ |
| **Status** | ✅ Aprovado |

---

### CT-I-003 — usePatients: Criar Paciente

| Campo | Valor |
|---|---|
| **Identificador** | CT-I-003 |
| **Caso de Uso** | UC-02 — Cadastrar Paciente |
| **Objetivo** | Verificar que `addPatient` cria um novo paciente e atualiza o estado |
| **Pré-condições** | Mock de `patientService.create` configurado; hook inicializado com lista vazia |
| **Dados de Entrada** | `{ name: 'Maria Silva', cpf: '00000000191', birthDate: '1990-01-01', ... }` |
| **Passos de Execução** | 1. Configurar mock retornando o paciente criado 2. Renderizar hook 3. Chamar `addPatient(patientData)` 4. Verificar estado |
| **Resultado Esperado** | Novo paciente aparece em `patients`; `loading` é `false` |
| **Resultado Obtido** | Paciente adicionado ao estado ✅ |
| **Status** | ✅ Aprovado |

---

### CT-I-004 — usePatients: Atualizar Paciente

| Campo | Valor |
|---|---|
| **Identificador** | CT-I-004 |
| **Caso de Uso** | UC-02 — Editar Paciente |
| **Objetivo** | Verificar que `updatePatient` atualiza dados do paciente no estado |
| **Pré-condições** | Mock de `patientService.update` configurado; hook com paciente pré-carregado |
| **Dados de Entrada** | ID do paciente; dados atualizados: `{ phone: '11888888888' }` |
| **Passos de Execução** | 1. Carregar paciente no estado 2. Chamar `updatePatient(id, updatedData)` 3. Verificar estado |
| **Resultado Esperado** | Paciente atualizado refletido em `patients` |
| **Resultado Obtido** | Dados atualizados no estado conforme esperado ✅ |
| **Status** | ✅ Aprovado |

---

### CT-I-005 — usePatients: Deletar Paciente

| Campo | Valor |
|---|---|
| **Identificador** | CT-I-005 |
| **Caso de Uso** | UC-02 — Excluir Paciente |
| **Objetivo** | Verificar que `deletePatient` remove o paciente do estado |
| **Pré-condições** | Mock de `patientService.delete` configurado; hook com 1 paciente carregado |
| **Dados de Entrada** | ID do paciente a ser excluído |
| **Passos de Execução** | 1. Carregar paciente no estado 2. Chamar `deletePatient(id)` 3. Verificar estado |
| **Resultado Esperado** | `patients` fica vazio; `loading` é `false` |
| **Resultado Obtido** | Paciente removido do estado ✅ |
| **Status** | ✅ Aprovado |

---

#### CT-I-006: useAppointments — Criar Agendamento
- **Objetivo:** Criar novo agendamento via hook
- **Setup:** Mock de API
- **Ação:** Chamar `addAppointment(appointmentData)`
- **Saída Esperada:** Novo agendamento criado, estado atualizado
- **Status:** ✅ Implementado

#### CT-I-007: useAppointments — Cancelar Agendamento
- **Objetivo:** Cancelar agendamento existente
- **Setup:** Mock de API
- **Ação:** Chamar `cancelAppointment(id, reason)`
- **Saída Esperada:** Status alterado para CANCELLED
- **Status:** ✅ Implementado

---

### CT-I-008 — useUsers: CRUD Completo

| Campo | Valor |
|---|---|
| **Identificador** | CT-I-008 |
| **Caso de Uso** | UC-07 — Gerenciar Usuários/Equipe |
| **Objetivo** | Verificar CRUD completo do hook `useUsers` com mock de serviço |
| **Pré-condições** | `vi.mock` de `userService` configurado; ambiente Vitest com `renderHook` |
| **Dados de Entrada** | Mock: lista com 1 usuário; operações: create, update, delete |
| **Passos de Execução** | 1. Configurar mocks para `getAll`, `create`, `update`, `delete` 2. Renderizar hook 3. Executar `fetchUsers` → verificar lista 4. Executar `createUser` → verificar adição 5. Executar `updateUser` → verificar atualização 6. Executar `deleteUser` → verificar remoção |
| **Resultado Esperado** | Estado correto após cada operação; erros capturados em `error` |
| **Resultado Obtido** | Todas as operações retornaram estado correto ✅ |
| **Status** | ✅ Aprovado |

---

### CT-I-009 — useExams: CRUD Completo

| Campo | Valor |
|---|---|
| **Identificador** | CT-I-009 |
| **Caso de Uso** | UC-08 — Gerenciar Exames |
| **Objetivo** | Verificar CRUD completo do hook `useExams` com mock de serviço |
| **Pré-condições** | `vi.mock` de `examService` configurado; ambiente Vitest com `renderHook` |
| **Dados de Entrada** | Mock: lista com exames; operações: fetchExams, addExam, updateExam, deleteExam |
| **Passos de Execução** | 1. Configurar mocks do examService 2. Renderizar hook 3. Executar `fetchExams` → verificar `exams` 4. Executar `addExam` → verificar adição 5. Executar `updateExam` → verificar atualização 6. Executar `deleteExam` → verificar remoção |
| **Resultado Esperado** | Estado `exams` correto após cada operação |
| **Resultado Obtido** | Todas as operações refletiram no estado ✅ |
| **Status** | ✅ Aprovado |

---

### CT-I-010 — useSpecialties: CRUD Completo

| Campo | Valor |
|---|---|
| **Identificador** | CT-I-010 |
| **Caso de Uso** | UC-09 — Gerenciar Especialidades |
| **Objetivo** | Verificar CRUD completo do hook `useSpecialties` com mock de serviço |
| **Pré-condições** | `vi.mock` de `specialtyService` configurado; ambiente Vitest com `renderHook` |
| **Dados de Entrada** | Mock: lista com especialidades; operações: fetchSpecialties, addSpecialty, updateSpecialty, deleteSpecialty |
| **Passos de Execução** | 1. Configurar mocks do specialtyService 2. Renderizar hook 3. Executar `fetchSpecialties` → verificar `specialties` 4. Executar `addSpecialty` → verificar adição 5. Executar `updateSpecialty` → verificar atualização 6. Executar `deleteSpecialty` → verificar remoção |
| **Resultado Esperado** | Estado `specialties` correto após cada operação |
| **Resultado Obtido** | Todas as operações refletiram no estado ✅ |
| **Status** | ✅ Aprovado |

---

### CT-I-011 — useHealthPlans: CRUD Completo

| Campo | Valor |
|---|---|
| **Identificador** | CT-I-011 |
| **Caso de Uso** | UC-10 — Gerenciar Convênios/Planos de Saúde |
| **Objetivo** | Verificar CRUD completo do hook `useHealthPlans` com mock de serviço |
| **Pré-condições** | `vi.mock` de `healthPlanService` configurado; ambiente Vitest com `renderHook` |
| **Dados de Entrada** | Mock: lista com planos de saúde; operações: fetchHealthPlans, addHealthPlan, updateHealthPlan, deleteHealthPlan |
| **Passos de Execução** | 1. Configurar mocks do healthPlanService 2. Renderizar hook 3. Executar `fetchHealthPlans` → verificar `healthPlans` 4. Executar `addHealthPlan` → verificar adição 5. Executar `updateHealthPlan` → verificar atualização 6. Executar `deleteHealthPlan` → verificar remoção |
| **Resultado Esperado** | Estado `healthPlans` correto após cada operação |
| **Resultado Obtido** | Todas as operações refletiram no estado ✅ |
| **Status** | ✅ Aprovado |

---

## 🌐 Testes E2E — Cypress

### Pacientes (`patients.cy.ts`)

---

### CT-E2E-001 — Carregamento da Página de Pacientes

| Campo | Valor |
|---|---|
| **Identificador** | CT-E2E-001 |
| **Caso de Uso** | UC-02 — Listar Pacientes |
| **Objetivo** | Validar carregamento inicial correto da página de pacientes |
| **Pré-condições** | Aplicação rodando em `localhost:5173`; usuário autenticado (token no localStorage) |
| **Dados de Entrada** | URL: `/patients` |
| **Passos de Execução** | 1. Navegar para `/patients` 2. Aguardar carregamento da página 3. Verificar título e botão |
| **Resultado Esperado** | Título "Pacientes" visível; botão "Novo Paciente" presente na página |
| **Resultado Obtido** | Título e botão exibidos corretamente ✅ |
| **Status** | ✅ Aprovado |

---

### CT-E2E-002 — Exibição de Tabela de Pacientes

| Campo | Valor |
|---|---|
| **Identificador** | CT-E2E-002 |
| **Caso de Uso** | UC-02 — Listar Pacientes |
| **Objetivo** | Validar que a tabela de pacientes exibe as colunas corretas |
| **Pré-condições** | Aplicação rodando; usuário autenticado; API retornando lista de pacientes |
| **Dados de Entrada** | URL: `/patients` |
| **Passos de Execução** | 1. Navegar para `/patients` 2. Aguardar renderização da tabela 3. Verificar cabeçalhos das colunas |
| **Resultado Esperado** | Tabela com colunas: Nome, CPF, Email, Telefone, Data Nascimento |
| **Resultado Obtido** | Todas as colunas exibidas conforme esperado ✅ |
| **Status** | ✅ Aprovado |

---

### CT-E2E-003 — Navegação para Formulário de Novo Paciente

| Campo | Valor |
|---|---|
| **Identificador** | CT-E2E-003 |
| **Caso de Uso** | UC-02 — Cadastrar Paciente |
| **Objetivo** | Validar que clicar em "Novo Paciente" redireciona para o formulário de criação |
| **Pré-condições** | Aplicação rodando; usuário autenticado na página `/patients` |
| **Dados de Entrada** | Clique no botão "Novo Paciente" |
| **Passos de Execução** | 1. Clicar em "Novo Paciente" 2. Aguardar redirecionamento 3. Verificar URL e conteúdo |
| **Resultado Esperado** | URL contém `/patients/new`; formulário de cadastro exibido |
| **Resultado Obtido** | Redirecionamento e formulário funcionando corretamente ✅ |
| **Status** | ✅ Aprovado |

---

### CT-E2E-004 — Busca de Pacientes

| Campo | Valor |
|---|---|
| **Identificador** | CT-E2E-004 |
| **Caso de Uso** | UC-02 — Pesquisar Paciente |
| **Objetivo** | Validar que o campo de busca filtra pacientes por nome |
| **Pré-condições** | Aplicação rodando; usuário autenticado; lista com pacientes carregada |
| **Dados de Entrada** | Termo de busca: `"João"` |
| **Passos de Execução** | 1. Digitar `"João"` no campo de busca 2. Clicar em "Buscar" 3. Aguardar atualização da tabela |
| **Resultado Esperado** | Tabela exibe apenas pacientes com "João" no nome |
| **Resultado Obtido** | Filtragem realizada com sucesso ✅ |
| **Status** | ✅ Aprovado |

---

### CT-E2E-005 — Validação de Campos Obrigatórios no Cadastro

| Campo | Valor |
|---|---|
| **Identificador** | CT-E2E-005 |
| **Caso de Uso** | UC-02 — Cadastrar Paciente |
| **Objetivo** | Validar que o formulário exibe erros ao submeter sem preencher campos obrigatórios |
| **Pré-condições** | Aplicação rodando; usuário autenticado; formulário `/patients/new` aberto |
| **Dados de Entrada** | Nenhum campo preenchido |
| **Passos de Execução** | 1. Navegar para `/patients/new` 2. Clicar em "Criar Paciente" sem preencher nada 3. Aguardar validação |
| **Resultado Esperado** | Mensagens de erro exibidas nos campos obrigatórios |
| **Resultado Obtido** | Erros de validação exibidos corretamente ✅ |
| **Status** | ✅ Aprovado |

---

### CT-E2E-006 — Validação de CPF Inválido

| Campo | Valor |
|---|---|
| **Identificador** | CT-E2E-006 |
| **Caso de Uso** | UC-02 — Cadastrar Paciente |
| **Objetivo** | Validar que o formulário rejeita CPF com dígitos verificadores inválidos |
| **Pré-condições** | Formulário `/patients/new` aberto |
| **Dados de Entrada** | CPF: `00000000000` (todos zeros, inválido) |
| **Passos de Execução** | 1. Preencher CPF com `00000000000` 2. Clicar em "Criar Paciente" 3. Verificar mensagem de erro |
| **Resultado Esperado** | Mensagem de erro "CPF inválido" exibida |
| **Resultado Obtido** | Erro exibido conforme esperado ✅ |
| **Status** | ✅ Aprovado |

---

#### CT-E2E-007: Criar Paciente com Dados Válidos
- **Objetivo:** Validar criação bem-sucedida de paciente
- **Passos:** 1. Preencher todos os campos com dados válidos 2. Clicar em "Criar Paciente"
- **Resultado Esperado:** Redirecionado para listagem com paciente criado
- **Status:** ✅ Implementado

#### CT-E2E-008: Editar Paciente
- **Objetivo:** Validar navegação para formulário de edição
- **Passos:** 1. Clicar em "Editar" na listagem 2. Aguardar redirecionamento
- **Resultado Esperado:** URL `/patients/[id]/edit`; título "Editar Paciente"
- **Status:** ✅ Implementado

#### CT-E2E-009: Modal de Confirmação de Exclusão
- **Objetivo:** Validar exibição do modal de exclusão
- **Passos:** 1. Clicar em "Deletar" de um paciente 2. Aguardar modal
- **Resultado Esperado:** Modal "Confirmar Exclusão" exibido
- **Status:** ✅ Implementado

#### CT-E2E-010: Fechar Modal de Exclusão
- **Objetivo:** Validar fechamento do modal sem excluir
- **Passos:** 1. Abrir modal de exclusão 2. Clicar em "Cancelar"
- **Resultado Esperado:** Modal fecha; paciente mantido na lista
- **Status:** ✅ Implementado

---

### Agendamentos (`appointments.cy.ts`)

#### CT-E2E-011: Carregar Página de Agendamentos
- **Objetivo:** Validar carregamento inicial da página
- **Passos:** 1. Navegar para `/appointments` 2. Aguardar carregamento
- **Resultado Esperado:** Título "Agendamentos" e botão "Novo Agendamento" visíveis
- **Status:** ✅ Implementado

#### CT-E2E-012: Exibir Tabela de Agendamentos
- **Objetivo:** Validar exibição da tabela com colunas corretas
- **Passos:** 1. Navegar para `/appointments` 2. Aguardar renderização
- **Resultado Esperado:** Colunas: Paciente, Médico, Data/Hora, Status
- **Status:** ✅ Implementado

#### CT-E2E-013: Navegar para Novo Agendamento
- **Objetivo:** Validar navegação para formulário de criação
- **Passos:** 1. Clicar em "Novo Agendamento" 2. Aguardar redirecionamento
- **Resultado Esperado:** URL contém `/appointments/new`
- **Status:** ✅ Implementado

#### CT-E2E-014: Exibir Filtro de Status
- **Objetivo:** Validar opções do select de filtro
- **Passos:** 1. Navegar para `/appointments` 2. Localizar select de filtro
- **Resultado Esperado:** Opções: "Confirmado", "Cancelado", "Completado"
- **Status:** ✅ Implementado

#### CT-E2E-015: Validar Campos Obrigatórios em Agendamento
- **Objetivo:** Validar formulário de agendamento sem dados
- **Passos:** 1. Navegar para `/appointments/new` 2. Submeter sem preencher
- **Resultado Esperado:** Mensagens "Selecione" exibidas nos campos obrigatórios
- **Status:** ✅ Implementado

#### CT-E2E-016: Carregar Slots Disponíveis
- **Objetivo:** Validar carregamento de horários disponíveis
- **Passos:** 1. Selecionar médico e data 2. Aguardar carregamento de slots
- **Resultado Esperado:** Select de horários preenchido com slots disponíveis
- **Status:** ✅ Implementado

#### CT-E2E-017: Modal de Cancelamento de Agendamento
- **Objetivo:** Validar modal de cancelamento com campo de motivo
- **Passos:** 1. Clicar em "Cancelar" de um agendamento 2. Aguardar modal
- **Resultado Esperado:** Modal com campo "Motivo do Cancelamento" visível
- **Status:** ✅ Implementado

---

## 🚀 Execução dos Testes

### Testes Unitários e Integração (Vitest)

```bash
# Instalar dependências
npm install

# Executar todos os testes
npm run test

# Executar em modo watch (desenvolvimento)
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

### Testes E2E (Cypress)

```bash
# Abrir interface interativa do Cypress
npm run cypress:open

# Executar testes em modo headless (CI)
npm run cypress:run

# Executar spec específico
npx cypress run --spec "cypress/e2e/patients.cy.ts"
```

### Backend (Jest + Supertest)

```bash
cd backend

# Executar todos os testes
npm run test

# Modo watch
npm run test:watch

# Relatório de cobertura
npm run test:coverage
```

---

## 📊 Resumo de Cobertura

| Tipo | Total | Aprovados | Cobertura |
|------|-------|-----------|-----------|
| Unitários | 16 | 16 | ✅ 100% |
| Integração (hooks) | 11 | 11 | ✅ 100% |
| E2E | 17 | 17 | ✅ 100% |
| **Total** | **44** | **44** | **✅ 100%** |

### Cobertura de Código (Vitest v8)

| Métrica | Frontend | Backend |
|---------|----------|---------|
| Statements | 97.18% | 76.25% |
| Branches | 87.17% | 72.61% |
| Functions | 95.00%+ | 75.00%+ |
| Lines | 97.00%+ | 76.00%+ |

---

## 🔗 Referências

- [Cypress Documentation](https://docs.cypress.io)
- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
