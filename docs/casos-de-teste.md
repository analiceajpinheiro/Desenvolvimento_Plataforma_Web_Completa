# Documentação de Casos de Teste - VitaLink Frontend

**Projeto:** VitaLink — Plataforma de Gestão em Saúde  
**Data:** Dezembro 2024  
**Escopo:** Testes Frontend (Cypress E2E + Vitest Unitários)

---

## 📋 Índice

1. [Testes Unitários](#testes-unitários)
2. [Testes de Integração](#testes-de-integração)
3. [Testes E2E](#testes-e2e)
4. [Execução dos Testes](#execução-dos-testes)

---

## 🧪 Testes Unitários

### 1. Validadores (`validators.test.ts`)

#### CT-U-001: Validar Email Correto
- **Objetivo:** Validar emails em formato correto
- **Entrada:** `test@example.com`, `user.name@domain.co.uk`
- **Saída Esperada:** `true`
- **Status:** ✅ Implementado

#### CT-U-002: Rejeitar Email Inválido
- **Objetivo:** Rejeitar emails malformados
- **Entrada:** `invalid`, `invalid@`, `@domain.com`
- **Saída Esperada:** `false`
- **Status:** ✅ Implementado

#### CT-U-003: Validar CPF Válido
- **Objetivo:** Validar CPF com dígitos verificadores corretos
- **Entrada:** `00000000191`
- **Saída Esperada:** `true`
- **Status:** ✅ Implementado

#### CT-U-004: Rejeitar CPF Inválido
- **Objetivo:** Rejeitar CPF com tamanho incorreto ou dígitos repetidos
- **Entrada:** `123`, `11111111111`
- **Saída Esperada:** `false`
- **Status:** ✅ Implementado

#### CT-U-005: Validar Telefone
- **Objetivo:** Validar telefone com 11 dígitos
- **Entrada:** `11999999999`, `(11)99999-9999`
- **Saída Esperada:** `true`
- **Status:** ✅ Implementado

#### CT-U-006: Formatar CPF
- **Objetivo:** Formatar CPF para `XXX.XXX.XXX-XX`
- **Entrada:** `12345678901`
- **Saída Esperada:** `123.456.789-01`
- **Status:** ✅ Implementado

#### CT-U-007: Formatar Telefone
- **Objetivo:** Formatar telefone para `(XX) XXXXX-XXXX`
- **Entrada:** `11999999999`
- **Saída Esperada:** `(11) 99999-9999`
- **Status:** ✅ Implementado

#### CT-U-008: Calcular Idade
- **Objetivo:** Calcular idade corretamente a partir da data de nascimento
- **Entrada:** `1990-01-15`
- **Saída Esperada:** Idade ≥ 34 (dependendo da data atual)
- **Status:** ✅ Implementado

### 2. Componente Alert (`Alert.test.tsx`)

#### CT-U-009: Renderizar Alerta de Sucesso
- **Objetivo:** Renderizar alerta com cor verde
- **Ação:** Render Alert com `type="success"`
- **Saída Esperada:** Elemento com classe `bg-green-100`
- **Status:** ✅ Implementado

#### CT-U-010: Renderizar Alerta de Erro
- **Objetivo:** Renderizar alerta com cor vermelha
- **Ação:** Render Alert com `type="error"`
- **Saída Esperada:** Elemento com classe `bg-red-100`
- **Status:** ✅ Implementado

#### CT-U-011: Exibir Botão de Fechar
- **Objetivo:** Mostrar botão de fechar se callback fornecido
- **Ação:** Render Alert com `onClose` callback
- **Saída Esperada:** Botão `×` visível
- **Status:** ✅ Implementado

### 3. Componente Button (`Button.test.tsx`)

#### CT-U-012: Renderizar Botão com Texto
- **Objetivo:** Renderizar botão com texto correto
- **Ação:** Render Button com children
- **Saída Esperada:** Texto visível no botão
- **Status:** ✅ Implementado

#### CT-U-013: Aplicar Variant Primary
- **Objetivo:** Aplicar estilos de variant primary
- **Ação:** Render Button com `variant="primary"`
- **Saída Esperada:** Classe `bg-blue-600` aplicada
- **Status:** ✅ Implementado

#### CT-U-014: Aplicar Variant Danger
- **Objetivo:** Aplicar estilos de variant danger
- **Ação:** Render Button com `variant="danger"`
- **Saída Esperada:** Classe `bg-red-600` aplicada
- **Status:** ✅ Implementado

#### CT-U-015: Desabilitar Botão ao Carregar
- **Objetivo:** Desabilitar botão e mostrar "Carregando..."
- **Ação:** Render Button com `loading={true}`
- **Saída Esperada:** Botão desabilitado, texto "Carregando..."
- **Status:** ✅ Implementado

#### CT-U-016: Aplicar Tamanhos Diferentes
- **Objetivo:** Aplicar tamanhos sm, md, lg corretamente
- **Ação:** Render Button com `size="sm"` e `size="lg"`
- **Saída Esperada:** Diferentes classes de padding aplicadas
- **Status:** ✅ Implementado

---

## 🔗 Testes de Integração

### Testes de Hooks

#### CT-I-001: usePatients - Carregar Pacientes
- **Objetivo:** Carregar lista de pacientes da API
- **Setup:** Mock de API com resposta de 10 pacientes
- **Ação:** Chamar `fetchPatients(1)`
- **Saída Esperada:** Array com 10 pacientes
- **Status:** ⏳ A Implementar

#### CT-I-002: usePatients - Buscar Pacientes
- **Objetivo:** Buscar pacientes por nome/CPF
- **Setup:** Mock de API
- **Ação:** Chamar `searchPatients('João')`
- **Saída Esperada:** Array de pacientes filtrados
- **Status:** ⏳ A Implementar

#### CT-I-003: usePatients - Criar Paciente
- **Objetivo:** Criar novo paciente
- **Setup:** Mock de API
- **Ação:** Chamar `addPatient(pacientData)`
- **Saída Esperada:** Novo paciente na lista
- **Status:** ⏳ A Implementar

#### CT-I-004: usePatients - Atualizar Paciente
- **Objetivo:** Atualizar dados do paciente
- **Setup:** Mock de API
- **Ação:** Chamar `updatePatient(id, pacientData)`
- **Saída Esperada:** Paciente atualizado na lista
- **Status:** ⏳ A Implementar

#### CT-I-005: usePatients - Deletar Paciente
- **Objetivo:** Deletar paciente
- **Setup:** Mock de API
- **Ação:** Chamar `deletePatient(id)`
- **Saída Esperada:** Paciente removido da lista
- **Status:** ⏳ A Implementar

#### CT-I-006: useAppointments - Criar Agendamento
- **Objetivo:** Criar novo agendamento
- **Setup:** Mock de API
- **Ação:** Chamar `addAppointment(appointmentData)`
- **Saída Esperada:** Novo agendamento criado
- **Status:** ⏳ A Implementar

#### CT-I-007: useAppointments - Cancelar Agendamento
- **Objetivo:** Cancelar agendamento existente
- **Setup:** Mock de API
- **Ação:** Chamar `cancelAppointment(id, reason)`
- **Saída Esperada:** Status alterado para CANCELLED
- **Status:** ⏳ A Implementar

#### CT-I-008: useUsers - Carregar e Gerenciar Usuários
- **Objetivo:** Testar CRUD completo via hook useUsers
- **Setup:** `vi.mock` do userService com Vitest
- **Ação:** Chamar `fetchUsers`, `createUser`, `updateUser`, `deleteUser`
- **Saída Esperada:** Estado atualizado corretamente após cada operação
- **Status:** ✅ Implementado (`useUsers.test.ts`)

#### CT-I-009: useExams - Carregar e Gerenciar Exames
- **Objetivo:** Testar CRUD completo via hook useExams
- **Setup:** `vi.mock` do examService com Vitest
- **Ação:** Chamar `fetchExams`, `addExam`, `updateExam`, `deleteExam`
- **Saída Esperada:** Estado atualizado corretamente após cada operação
- **Status:** ✅ Implementado (`useExams.test.ts`)

#### CT-I-010: useSpecialties - Carregar e Gerenciar Especialidades
- **Objetivo:** Testar CRUD completo via hook useSpecialties
- **Setup:** `vi.mock` do specialtyService com Vitest
- **Ação:** Chamar `fetchSpecialties`, `addSpecialty`, `updateSpecialty`, `deleteSpecialty`
- **Saída Esperada:** Estado atualizado corretamente após cada operação
- **Status:** ✅ Implementado (`useSpecialties.test.ts`)

#### CT-I-011: useHealthPlans - Carregar e Gerenciar Convênios
- **Objetivo:** Testar CRUD completo via hook useHealthPlans
- **Setup:** `vi.mock` do healthPlanService com Vitest
- **Ação:** Chamar `fetchHealthPlans`, `addHealthPlan`, `updateHealthPlan`, `deleteHealthPlan`
- **Saída Esperada:** Estado atualizado corretamente após cada operação
- **Status:** ✅ Implementado (`useHealthPlans.test.ts`)

---

## 🌐 Testes E2E - Cypress

### Pacientes (`patients.cy.ts`)

#### CT-E2E-001: Carregue a Página de Pacientes
- **Objetivo:** Validar carregamento inicial da página
- **Passos:**
  1. Navegue para `/patients`
  2. Aguarde carregamento da página
- **Resultado Esperado:** Título "Pacientes" e botão "Novo Paciente" visíveis
- **Status:** ✅ Implementado

#### CT-E2E-002: Exiba Tabela de Pacientes
- **Objetivo:** Validar exibição da tabela com dados
- **Passos:**
  1. Navegue para `/patients`
  2. Aguarde renderização da tabela
- **Resultado Esperado:** Tabela com colunas: Nome, CPF, Email, Telefone, Data Nascimento
- **Status:** ✅ Implementado

#### CT-E2E-003: Navegue para Novo Paciente
- **Objetivo:** Validar navegação para formulário de criação
- **Passos:**
  1. Clique em "Novo Paciente"
  2. Aguarde redirecionamento
- **Resultado Esperado:** URL contém `/patients/new`, formulário exibido
- **Status:** ✅ Implementado

#### CT-E2E-004: Busque Pacientes
- **Objetivo:** Validar busca de pacientes por nome
- **Passos:**
  1. Digite "João" no campo de busca
  2. Clique em "Buscar"
  3. Aguarde resultado
- **Resultado Esperado:** Tabela contém apenas pacientes com "João"
- **Status:** ✅ Implementado

#### CT-E2E-005: Valide Campos Obrigatórios
- **Objetivo:** Validar validação de formulário
- **Passos:**
  1. Navegue para `/patients/new`
  2. Clique em "Criar Paciente" sem preencher
- **Resultado Esperado:** Mensagens de erro exibidas
- **Status:** ✅ Implementado

#### CT-E2E-006: Valide CPF Inválido
- **Objetivo:** Validar validação de CPF
- **Passos:**
  1. Preencha CPF com "00000000000"
  2. Clique em "Criar Paciente"
- **Resultado Esperado:** Erro "CPF inválido" exibido
- **Status:** ✅ Implementado

#### CT-E2E-007: Crie Paciente com Dados Válidos
- **Objetivo:** Validar criação bem-sucedida de paciente
- **Passos:**
  1. Preencha todos os campos com dados válidos
  2. Clique em "Criar Paciente"
  3. Aguarde submissão
- **Resultado Esperado:** Paciente criado, redirecionado para listagem
- **Status:** ✅ Implementado (UI validada)

#### CT-E2E-008: Edite Paciente
- **Objetivo:** Validar navegação para edição
- **Passos:**
  1. Na listagem, clique em "Editar" de um paciente
  2. Aguarde redirecionamento
- **Resultado Esperado:** URL contém `/patients/[id]/edit`, título "Editar Paciente"
- **Status:** ✅ Implementado

#### CT-E2E-009: Modal de Confirmação de Exclusão
- **Objetivo:** Validar modal de confirmação
- **Passos:**
  1. Clique em "Deletar" de um paciente
  2. Aguarde modal aparecer
- **Resultado Esperado:** Modal com título "Confirmar Exclusão" exibido
- **Status:** ✅ Implementado

#### CT-E2E-010: Feche Modal de Exclusão
- **Objetivo:** Validar fechamento do modal
- **Passos:**
  1. Clique em "Deletar"
  2. Clique em "Cancelar"
  3. Aguarde fechamento
- **Resultado Esperado:** Modal desaparece, paciente não deletado
- **Status:** ✅ Implementado

### Agendamentos (`appointments.cy.ts`)

#### CT-E2E-011: Carregue Página de Agendamentos
- **Objetivo:** Validar carregamento inicial
- **Passos:**
  1. Navegue para `/appointments`
  2. Aguarde carregamento
- **Resultado Esperado:** Título "Agendamentos" e botão "Novo Agendamento" visíveis
- **Status:** ✅ Implementado

#### CT-E2E-012: Exiba Tabela de Agendamentos
- **Objetivo:** Validar exibição da tabela
- **Passos:**
  1. Navegue para `/appointments`
  2. Aguarde renderização
- **Resultado Esperado:** Tabela com colunas: Paciente, Médico, Data/Hora, Status
- **Status:** ✅ Implementado

#### CT-E2E-013: Navegue para Novo Agendamento
- **Objetivo:** Validar navegação para formulário
- **Passos:**
  1. Clique em "Novo Agendamento"
  2. Aguarde redirecionamento
- **Resultado Esperado:** URL contém `/appointments/new`, formulário exibido
- **Status:** ✅ Implementado

#### CT-E2E-014: Exiba Filtro de Status
- **Objetivo:** Validar filtro de agendamentos
- **Passos:**
  1. Navegue para `/appointments`
  2. Localize select de filtro
- **Resultado Esperado:** Select com opções: "Confirmado", "Cancelado", "Completado"
- **Status:** ✅ Implementado

#### CT-E2E-015: Valide Campos Obrigatórios
- **Objetivo:** Validar validação de formulário
- **Passos:**
  1. Navegue para `/appointments/new`
  2. Clique em "Agendar Consulta" sem preencher
- **Resultado Esperado:** Mensagens "Selecione" exibidas
- **Status:** ✅ Implementado

#### CT-E2E-016: Carregue Slots Disponíveis
- **Objetivo:** Validar carregamento de horários
- **Passos:**
  1. Selecione um médico e uma data
  2. Aguarde carregamento de slots
- **Resultado Esperado:** Select de horários preenchido com slots disponíveis
- **Status:** ✅ Implementado

#### CT-E2E-017: Modal de Cancelamento
- **Objetivo:** Validar modal de cancelamento
- **Passos:**
  1. Clique em "Cancelar" de um agendamento
  2. Aguarde modal aparecer
- **Resultado Esperado:** Modal com campo "Motivo do Cancelamento"
- **Status:** ✅ Implementado

---

## 🚀 Execução dos Testes

### Testes Unitários (Vitest)

```bash
# Instalar dependências
npm install

# Executar todos os testes
npm run test

# Executar em modo watch
npm run test:watch

# Gerar coverage report
npm run test:coverage
```

### Testes E2E (Cypress)

```bash
# Abrir Cypress UI
npm run cypress:open

# Executar testes em headless
npm run cypress:run

# Executar teste específico
npx cypress run --spec "cypress/e2e/patients.cy.ts"
```

---

## 📊 Cobertura de Testes

| Tipo | Total | Implementados | Status |
|------|-------|---------------|--------|
| Unitários | 16 | 16 | ✅ 100% |
| Integração (hooks) | 11 | 4 | ⏳ 36% |
| E2E | 17 | 17 | ✅ 100% |
| **Total** | **44** | **37** | **⏳ 84%** |

---

## 📝 Próximos Passos

1. ✅ Implementar testes de integração para hooks
2. ✅ Adicionar testes para páginas (PatientsList, AppointmentsForm)
3. ✅ Mock de API com MSW (Mock Service Worker)
4. ✅ Configurar CI/CD para executar testes automaticamente
5. ✅ Melhorar cobertura para 90%+

---

## 🔗 Referências

- [Cypress Documentation](https://docs.cypress.io)
- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Best Practices for Testing](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
