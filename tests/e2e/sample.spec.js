describe('User Flow Tests', () => {
    beforeEach(() => {
      // Visit your application URL or start from a specific page
      cy.visit('http://localhost:3000');
    });
  
    it('should display user login form', () => {
      cy.contains('Login').click();
      cy.url().should('include', '/login');
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.contains('Welcome, testuser').should('be.visible');
    });
  
    it('should navigate to profile page', () => {
      // Example of navigating to user profile page
      cy.contains('Profile').click();
      cy.url().should('include', '/profile');
      // Add assertions for profile page content
    });
  
    // Add more E2E tests as needed
  });
  