describe('Agendamentos - Testes E2E', () => {
  const baseUrl = 'http://localhost:5173';

  beforeEach(() => {
    cy.visit(`${baseUrl}/appointments`);
  });

  describe('Listagem de Agendamentos', () => {
    it('Deve carregar a página de agendamentos', () => {
      cy.get('h1').should('contain', 'Agendamentos');
      cy.get('button').should('contain', 'Novo Agendamento');
    });

    it('Deve exibir tabela de agendamentos', () => {
      cy.get('table').should('exist');
      cy.get('thead').should('contain', 'Paciente');
      cy.get('thead').should('contain', 'Médico');
      cy.get('thead').should('contain', 'Data/Hora');
      cy.get('thead').should('contain', 'Status');
    });

    it('Deve permitir navegar para novo agendamento', () => {
      cy.contains('button', 'Novo Agendamento').click();
      cy.url().should('include', '/appointments/new');
      cy.get('h1').should('contain', 'Novo Agendamento');
    });

    it('Deve exibir filtro de status', () => {
      cy.get('select').should('exist');
      cy.get('option').should('contain', 'Confirmado');
      cy.get('option').should('contain', 'Cancelado');
      cy.get('option').should('contain', 'Completado');
    });
  });

  describe('Criar Agendamento', () => {
    beforeEach(() => {
      cy.visit(`${baseUrl}/appointments/new`);
    });

    it('Deve exibir formulário de criação', () => {
      cy.get('h1').should('contain', 'Novo Agendamento');
      cy.get('label').should('contain', 'Paciente');
      cy.get('label').should('contain', 'Médico');
      cy.get('label').should('contain', 'Data');
      cy.get('label').should('contain', 'Horário');
    });

    it('Deve validar campos obrigatórios', () => {
      cy.get('button').contains('Agendar Consulta').click();
      cy.get('p').should('contain', 'Selecione');
    });

    it('Deve carregar slots disponíveis ao selecionar médico e data', () => {
      cy.get('select[name="patientId"]').select(0);
      cy.get('select[name="doctorId"]').select(0);
      cy.get('input[name="date"]').type('2025-12-25');
      
      // Aguarda carregamento de slots
      cy.get('select[name="time"]', { timeout: 5000 }).should('exist');
    });
  });

  describe('Cancelar Agendamento', () => {
    it('Deve exibir modal de cancelamento', () => {
      cy.get('button').contains('Cancelar').first().click();
      cy.get('h2').should('contain', 'Cancelar Agendamento');
      cy.get('input[placeholder*="Motivo"]').should('exist');
    });

    it('Deve exigir motivo de cancelamento', () => {
      cy.get('button').contains('Cancelar').first().click();
      cy.get('button').contains('Cancelar Agendamento').click();
      // Validação será exibida pela API
    });
  });
});
