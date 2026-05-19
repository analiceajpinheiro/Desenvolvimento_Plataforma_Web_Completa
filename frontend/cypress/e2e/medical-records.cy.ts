describe('Prontuários - Testes E2E', () => {
  const baseUrl = 'http://localhost:5173';

  beforeEach(() => {
    cy.login(Cypress.env('email'), Cypress.env('password'));
    cy.visit(`${baseUrl}/medical-records`);
  });

  describe('Listagem de Prontuários', () => {
    it('deve listar prontuários', () => {
      cy.get('h1').should('contain', 'Prontuários');
      cy.get('button').should('contain', 'Novo Prontuário');
      cy.get('table').should('exist');
      cy.get('thead').should('contain', 'Paciente');
      cy.get('thead').should('contain', 'Médico');
    });
  });

  describe('Criar Prontuário', () => {
    it('deve criar um novo prontuário', () => {
      cy.contains('button', 'Novo Prontuário').click();
      cy.url().should('include', '/medical-records/new');
      cy.get('h1').should('contain', 'Novo Prontuário');
      cy.get('label').should('contain', 'Paciente');
      cy.get('label').should('contain', 'Médico');
      cy.get('label').should('contain', 'Queixa Principal');
    });
  });

  describe('Editar Prontuário', () => {
    it('deve editar um prontuário existente', () => {
      cy.get('button').contains('Editar').first().click();
      cy.url().should('include', '/medical-records/').and('include', '/edit');
      cy.get('h1').should('contain', 'Editar Prontuário');
    });
  });

  describe('Excluir Prontuário', () => {
    it('deve excluir um prontuário', () => {
      cy.get('button').contains('Excluir').first().click();
      cy.get('h2').should('contain', 'Confirmar Exclusão');
      cy.get('p').should('contain', 'Tem certeza');
    });
  });
});
