# Documentação de Casos de Uso — VitaLink

**Projeto:** VitaLink — Plataforma de Gestão em Saúde  
**Disciplina:** Desenvolvimento Web — CESUPA  
**Sprint:** 1

---

## Padrão de Descrição

Cada caso de uso contém: **Ator, Pré-condições, Fluxo Principal, Fluxos Alternativos e Pós-condições.**

---

## UC01 — Cadastrar Paciente

- **Ator:** Recepcionista
- **Pré-condições:** Usuário autenticado com perfil de recepcionista ou médico
- **Fluxo Principal:**
  1. Usuário acessa o módulo "Pacientes" e clica em "Novo Paciente"
  2. Sistema exibe formulário com campos: nome, CPF, data de nascimento, sexo, telefone, e-mail, endereço
  3. Usuário preenche os dados e confirma
  4. Sistema valida CPF e unicidade do registro
  5. Sistema geocodifica o endereço via API Nominatim
  6. Sistema salva o paciente e exibe mensagem de sucesso
- **Fluxos Alternativos:**
  - 4a. CPF já cadastrado → sistema exibe alerta e bloqueia duplicata
  - 5a. Endereço não encontrado → sistema salva sem coordenadas geográficas
- **Pós-condições:** Paciente cadastrado e disponível para agendamentos

---

## UC02 — Editar Dados do Paciente

- **Ator:** Recepcionista / Médico
- **Pré-condições:** Paciente já cadastrado no sistema; usuário autenticado
- **Fluxo Principal:**
  1. Usuário busca o paciente por nome ou CPF
  2. Sistema exibe os dados atuais do paciente
  3. Usuário clica em "Editar" e altera os campos desejados
  4. Sistema valida as alterações
  5. Sistema salva e registra log de alteração com data/hora e autor
- **Fluxos Alternativos:**
  - 4a. Dados inválidos → sistema destaca campos com erro
- **Pós-condições:** Dados atualizados; histórico de alterações registrado

---

## UC03 — Excluir Paciente

- **Ator:** Administrador
- **Pré-condições:** Paciente cadastrado; usuário com perfil de administrador
- **Fluxo Principal:**
  1. Administrador localiza o paciente
  2. Clica em "Excluir"
  3. Sistema exibe modal de confirmação alertando sobre dados vinculados
  4. Administrador confirma a exclusão
  5. Sistema realiza exclusão lógica (soft delete), preservando histórico
- **Fluxos Alternativos:**
  - 4a. Administrador cancela → nenhuma alteração é feita
- **Pós-condições:** Paciente marcado como inativo; dados preservados para auditoria

---

## UC04 — Agendar Consulta

- **Ator:** Recepcionista
- **Pré-condições:** Paciente cadastrado; médico disponível na data/hora escolhida
- **Fluxo Principal:**
  1. Usuário acessa "Agendamentos" e clica em "Nova Consulta"
  2. Seleciona o paciente, o médico, a data e o horário
  3. Sistema verifica disponibilidade na agenda do médico
  4. Sistema cria o agendamento com status "Confirmado"
  5. Sistema registra o agendamento e exibe confirmação
- **Fluxos Alternativos:**
  - 3a. Horário já ocupado → sistema sugere horários alternativos disponíveis
- **Pós-condições:** Consulta agendada; disponível na agenda do médico e do paciente

---

## UC05 — Cancelar Consulta

- **Ator:** Recepcionista / Paciente (via portal)
- **Pré-condições:** Consulta agendada com status "Confirmado"
- **Fluxo Principal:**
  1. Usuário localiza a consulta na agenda
  2. Clica em "Cancelar Consulta"
  3. Sistema solicita motivo do cancelamento
  4. Usuário informa o motivo e confirma
  5. Sistema altera status para "Cancelado" e libera o horário
- **Fluxos Alternativos:**
  - 2a. Consulta cancelada com menos de 2h de antecedência → sistema exibe aviso de política de cancelamento
- **Pós-condições:** Horário liberado; consulta marcada como cancelada no histórico

---

## UC06 — Realizar Atendimento (Abrir Prontuário)

- **Ator:** Médico
- **Pré-condições:** Consulta com status "Confirmado"; médico autenticado
- **Fluxo Principal:**
  1. Médico acessa a agenda e clica em "Iniciar Atendimento"
  2. Sistema abre o prontuário do paciente
  3. Médico preenche: queixa principal, histórico, exame físico, hipótese diagnóstica, conduta e prescrição
  4. Médico salva o prontuário
  5. Sistema marca a consulta como "Realizada"
- **Fluxos Alternativos:**
  - 3a. Médico salva como rascunho → status da consulta permanece "Em andamento"
- **Pós-condições:** Prontuário registrado; consulta finalizada

---

## UC07 — Visualizar Histórico do Paciente

- **Ator:** Médico
- **Pré-condições:** Paciente com pelo menos uma consulta realizada; médico autenticado
- **Fluxo Principal:**
  1. Médico acessa o perfil do paciente
  2. Clica na aba "Histórico"
  3. Sistema exibe lista de consultas em ordem cronológica decrescente
  4. Médico clica em uma consulta para visualizar o prontuário completo
- **Fluxos Alternativos:**
  - 3a. Sem histórico → sistema exibe mensagem "Nenhum atendimento registrado"
- **Pós-condições:** Médico visualiza o histórico sem alterações nos dados

---

## UC08 — Autenticar no Sistema (Login)

- **Ator:** Qualquer usuário (Médico, Recepcionista, Administrador)
- **Pré-condições:** Usuário cadastrado no sistema com e-mail e senha
- **Fluxo Principal:**
  1. Usuário acessa a tela de login
  2. Informa e-mail e senha
  3. Sistema valida as credenciais
  4. Sistema gera token JWT e redireciona para o dashboard
- **Fluxos Alternativos:**
  - 3a. Credenciais inválidas → sistema exibe erro genérico (sem revelar qual campo está errado)
  - 3b. Após 5 tentativas falhas → conta bloqueada por 15 minutos
- **Pós-condições:** Sessão autenticada com token JWT válido por 8 horas

---

## UC09 — Cadastrar Usuário (Equipe)

- **Ator:** Administrador
- **Pré-condições:** Usuário autenticado com perfil de administrador
- **Fluxo Principal:**
  1. Administrador acessa "Equipe" e clica em "Novo Usuário"
  2. Preenche: nome, e-mail, perfil (Médico / Recepcionista / Admin) e especialidade (se médico)
  3. Sistema envia e-mail com link de definição de senha
  4. Sistema cria o usuário com status "Pendente" até a definição da senha
- **Fluxos Alternativos:**
  - 2a. E-mail já cadastrado → sistema bloqueia duplicata
- **Pós-condições:** Usuário criado e notificado por e-mail

---

## UC10 — Buscar Clínicas/Farmácias Próximas (API Externa)

- **Ator:** Recepcionista / Médico
- **Pré-condições:** Endereço do paciente cadastrado e geocodificado
- **Fluxo Principal:**
  1. Usuário acessa o perfil do paciente e clica em "Estabelecimentos Próximos"
  2. Sistema consulta a API Nominatim com as coordenadas do paciente
  3. Sistema exibe mapa com clínicas e farmácias em raio de 5 km
  4. Usuário pode filtrar por tipo de estabelecimento
- **Fluxos Alternativos:**
  - 2a. API indisponível → sistema exibe mensagem de erro e sugere tentar novamente
  - 2b. Endereço sem geocodificação → sistema solicita atualização do endereço
- **Pós-condições:** Lista de estabelecimentos exibida sem persistência no banco

---

## UC11 — Editar Prontuário

- **Ator:** Médico (autor do prontuário)
- **Pré-condições:** Prontuário existente; médico autenticado e autor do registro; edição dentro de 24h da criação
- **Fluxo Principal:**
  1. Médico acessa o prontuário
  2. Clica em "Editar"
  3. Altera os campos desejados
  4. Sistema salva com registro de alteração (versão anterior preservada)
- **Fluxos Alternativos:**
  - 1a. Prazo de edição expirado → sistema exibe botão desabilitado com tooltip explicativo
  - 1b. Médico não é o autor → opção de edição não disponível
- **Pós-condições:** Prontuário atualizado; versão anterior arquivada

---

## UC12 — Gerar Relatório de Atendimentos

- **Ator:** Administrador / Médico
- **Pré-condições:** Usuário autenticado; existência de consultas no período selecionado
- **Fluxo Principal:**
  1. Usuário acessa "Relatórios"
  2. Seleciona período, médico (opcional) e tipo de relatório
  3. Sistema processa e exibe o relatório em tela
  4. Usuário pode exportar em PDF ou CSV
- **Fluxos Alternativos:**
  - 3a. Nenhum atendimento no período → sistema exibe relatório vazio com mensagem
- **Pós-condições:** Relatório exibido/exportado sem alteração de dados

---

## UC13 — Redefinir Senha

- **Ator:** Qualquer usuário
- **Pré-condições:** E-mail cadastrado no sistema
- **Fluxo Principal:**
  1. Usuário clica em "Esqueci minha senha" na tela de login
  2. Informa o e-mail cadastrado
  3. Sistema envia link de redefinição válido por 1 hora
  4. Usuário acessa o link, define nova senha e confirma
  5. Sistema atualiza a senha e invalida o link
- **Fluxos Alternativos:**
  - 2a. E-mail não cadastrado → sistema exibe mensagem genérica (sem revelar existência da conta)
  - 4a. Link expirado → sistema redireciona para nova solicitação
- **Pós-condições:** Senha atualizada; link de redefinição invalidado

---

## UC14 — Visualizar Dashboard

- **Ator:** Médico / Recepcionista / Administrador
- **Pré-condições:** Usuário autenticado
- **Fluxo Principal:**
  1. Após login, sistema redireciona para o Dashboard
  2. Sistema exibe métricas do dia: consultas agendadas, realizadas e canceladas
  3. Sistema exibe agenda do dia com próximas consultas
  4. Métricas são filtradas pelo perfil do usuário (médico vê só seus dados; admin vê todos)
- **Fluxos Alternativos:**
  - 2a. Sem dados do dia → sistema exibe estado vazio com mensagem amigável
- **Pós-condições:** Usuário visualiza resumo operacional do dia

---

## UC15 — Registrar Prescrição Médica

- **Ator:** Médico
- **Pré-condições:** Prontuário aberto durante atendimento; médico autenticado
- **Fluxo Principal:**
  1. Durante o atendimento, médico acessa a aba "Prescrição"
  2. Adiciona medicamentos com: nome, dosagem, frequência e duração
  3. Adiciona observações e orientações ao paciente
  4. Salva a prescrição vinculada ao prontuário
  5. Sistema disponibiliza prescrição para impressão/PDF
- **Fluxos Alternativos:**
  - 2a. Médico tenta adicionar medicamento sem dosagem → sistema bloqueia e destaca campo obrigatório
- **Pós-condições:** Prescrição registrada no prontuário; disponível para impressão

---

*Total: 15 casos de uso — cobrindo os fluxos principais da plataforma VitaLink*
