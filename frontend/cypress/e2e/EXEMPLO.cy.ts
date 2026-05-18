// Exemplo de teste E2E com Cypress
// Este é um template para orientar a estrutura de testes E2E

/**
 * Testes E2E (end-to-end) simulam a jornada do usuário
 * Eles testam o fluxo completo da aplicação
 * 
 * Estrutura recomendada:
 * 1. Visitar a página
 * 2. Interagir com elementos
 * 3. Validar comportamento esperado
 */

describe('Exemplo de Fluxo de Usuário', () => {
  beforeEach(() => {
    // Antes de cada teste, visitar a página inicial
    cy.visit('http://localhost:5173');
  });

  it('deve exibir a página inicial', () => {
    cy.contains('VitaLink').should('be.visible');
  });

  describe('Autenticação', () => {
    it('deve fazer login com credenciais válidas', () => {
      // Navegar para login
      cy.visit('http://localhost:5173/login');

      // Preencher formulário
      cy.get('[data-cy=email]').type('usuario@example.com');
      cy.get('[data-cy=password]').type('senha123');

      // Clicar em enviar
      cy.get('[data-cy=submit-btn]').click();

      // Validar redirecionamento
      cy.url().should('include', '/dashboard');
      cy.contains('Dashboard').should('be.visible');
    });

    it('deve exibir erro com credenciais inválidas', () => {
      cy.visit('http://localhost:5173/login');

      cy.get('[data-cy=email]').type('invalido@example.com');
      cy.get('[data-cy=password]').type('senhaerrada');
      cy.get('[data-cy=submit-btn]').click();

      cy.contains('Credenciais inválidas').should('be.visible');
    });
  });

  describe('Gerenciamento de Pacientes', () => {
    beforeEach(() => {
      // Fazer login antes dos testes de paciente
      cy.visit('http://localhost:5173/login');
      cy.get('[data-cy=email]').type('usuario@example.com');
      cy.get('[data-cy=password]').type('senha123');
      cy.get('[data-cy=submit-btn]').click();
      cy.url().should('include', '/dashboard');
    });

    it('deve criar novo paciente', () => {
      cy.visit('http://localhost:5173/pacientes');
      cy.get('[data-cy=new-btn]').click();

      cy.get('[data-cy=name]').type('João Silva');
      cy.get('[data-cy=cpf]').type('12345678900');
      cy.get('[data-cy=email]').type('joao@example.com');
      cy.get('[data-cy=submit]').click();

      cy.contains('Paciente cadastrado com sucesso').should('be.visible');
    });

    it('deve editar paciente', () => {
      cy.visit('http://localhost:5173/pacientes');
      cy.get('[data-cy=edit-btn]').first().click();

      cy.get('[data-cy=name]').clear().type('João da Silva');
      cy.get('[data-cy=submit]').click();

      cy.contains('Paciente atualizado').should('be.visible');
    });

    it('deve deletar paciente', () => {
      cy.visit('http://localhost:5173/pacientes');
      cy.get('[data-cy=delete-btn]').first().click();

      cy.contains('Confirmar exclusão').should('be.visible');
      cy.get('[data-cy=confirm-delete]').click();

      cy.contains('Paciente removido').should('be.visible');
    });
  });

  describe('Responsividade', () => {
    it('deve ser responsivo em mobile', () => {
      cy.viewport('iphone-x');
      cy.contains('VitaLink').should('be.visible');
      cy.get('[data-cy=menu]').should('be.visible');
    });

    it('deve ser responsivo em tablet', () => {
      cy.viewport('ipad-2');
      cy.contains('VitaLink').should('be.visible');
    });
  });
});
