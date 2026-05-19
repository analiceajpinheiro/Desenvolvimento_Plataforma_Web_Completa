describe('Autenticação - Testes E2E', () => {
  const baseUrl = 'http://localhost:5173';

  describe('Página de Login', () => {
    it('deve exibir a página de login', () => {
      cy.visit(`${baseUrl}/login`);
      cy.get('h1').should('contain', 'VitaLink');
      cy.get('h2').should('contain', 'Entrar');
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Entrar');
    });

    it('deve fazer login com credenciais válidas', () => {
      cy.visit(`${baseUrl}/login`);
      cy.get('input[name="email"]').type(Cypress.env('email'));
      cy.get('input[name="password"]').type(Cypress.env('password'));
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
      cy.get('h1').should('contain', 'Bem-vindo');
    });

    it('deve mostrar erro com credenciais inválidas', () => {
      cy.visit(`${baseUrl}/login`);
      cy.get('input[name="email"]').type('invalido@email.com');
      cy.get('input[name="password"]').type('senhaerrada123');
      cy.get('button[type="submit"]').click();
      cy.get('p').should('contain', 'inválid');
    });

    it('deve redirecionar para /login quando não autenticado', () => {
      cy.visit(`${baseUrl}/dashboard`);
      cy.url().should('include', '/login');
    });
  });
});
