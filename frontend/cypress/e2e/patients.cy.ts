describe('Pacientes - Testes E2E', () => {
  const baseUrl = 'http://localhost:5173';

  beforeEach(() => {
    cy.visit(`${baseUrl}/patients`);
  });

  describe('Listagem de Pacientes', () => {
    it('Deve carregar a página de pacientes', () => {
      cy.get('h1').should('contain', 'Pacientes');
      cy.get('button').should('contain', 'Novo Paciente');
    });

    it('Deve exibir tabela de pacientes', () => {
      cy.get('table').should('exist');
      cy.get('thead').should('contain', 'Nome');
      cy.get('thead').should('contain', 'CPF');
      cy.get('thead').should('contain', 'Email');
    });

    it('Deve permitir navegar para novo paciente', () => {
      cy.contains('button', 'Novo Paciente').click();
      cy.url().should('include', '/patients/new');
      cy.get('h1').should('contain', 'Novo Paciente');
    });

    it('Deve permitir buscar pacientes', () => {
      cy.get('input[placeholder*="Buscar"]').type('João');
      cy.get('button').contains('Buscar').click();
      cy.get('table tbody tr').should('exist');
    });
  });

  describe('Criar Paciente', () => {
    beforeEach(() => {
      cy.visit(`${baseUrl}/patients/new`);
    });

    it('Deve exibir formulário de criação', () => {
      cy.get('h1').should('contain', 'Novo Paciente');
      cy.get('label').should('contain', 'Nome Completo');
      cy.get('label').should('contain', 'CPF');
      cy.get('label').should('contain', 'Email');
    });

    it('Deve validar campos obrigatórios', () => {
      cy.get('button').contains('Criar Paciente').click();
      cy.get('p').should('contain', 'é obrigatório');
    });

    it('Deve validar CPF inválido', () => {
      cy.get('input[name="name"]').type('João da Silva');
      cy.get('input[name="cpf"]').type('00000000000');
      cy.get('button').contains('Criar Paciente').click();
      cy.get('p').should('contain', 'CPF inválido');
    });

    it('Deve preencer e enviar formulário com dados válidos', () => {
      const cpf = '12345678901'; // Exemplo - será validado
      const email = `paciente-${Date.now()}@example.com`;

      cy.get('input[name="name"]').type('Maria Silva');
      cy.get('input[name="cpf"]').type(cpf);
      cy.get('input[name="birthDate"]').type('1990-01-15');
      cy.get('select[name="gender"]').select('F');
      cy.get('input[name="phone"]').type('11999999999');
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="address"]').type('Rua Principal, 123, São Paulo');

      // Nota: Sem backend, o submit não funcionará, mas testa a UI
      cy.get('button').contains('Criar Paciente').should('not.be.disabled');
    });
  });

  describe('Editar Paciente', () => {
    it('Deve navegar para edição ao clicar em Editar', () => {
      cy.get('button').contains('Editar').first().click();
      cy.url().should('include', '/patients/').and('include', '/edit');
      cy.get('h1').should('contain', 'Editar Paciente');
    });
  });

  describe('Deletar Paciente', () => {
    it('Deve exibir modal de confirmação ao clicar em Deletar', () => {
      cy.get('button').contains('Deletar').first().click();
      cy.get('h2').should('contain', 'Confirmar Exclusão');
      cy.get('p').should('contain', 'Tem certeza');
    });

    it('Deve fechar modal ao clicar em Cancelar', () => {
      cy.get('button').contains('Deletar').first().click();
      cy.get('button').contains('Cancelar').click();
      cy.get('h2').should('not.exist');
    });
  });
});
