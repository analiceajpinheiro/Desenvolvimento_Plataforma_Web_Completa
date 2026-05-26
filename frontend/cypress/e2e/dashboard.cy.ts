describe('Dashboard - Testes E2E', () => {
  beforeEach(() => {
    cy.login(Cypress.env('email'), Cypress.env('password'));
  });

  it('deve exibir cards de métricas após login', () => {
    cy.url().should('include', '/dashboard');
    cy.get('h1,h2').should('exist');
    cy.get('[class*="card"],[class*="metric"],[class*="stat"]').should('exist');
  });

  it('deve mostrar agenda de hoje', () => {
    cy.url().should('include', '/dashboard');
    cy.get('body').should('contain.text', 'Hoje').or('contain.text', 'hoje').or('contain.text', 'Agendamentos');
  });

  it('deve navegar para pacientes pelo card', () => {
    cy.url().should('include', '/dashboard');
    cy.contains('a,button', /paciente/i).first().click();
    cy.url().should('include', '/patients');
  });
});
