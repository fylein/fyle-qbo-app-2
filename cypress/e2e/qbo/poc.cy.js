/// <reference types="cypress" />

describe('example to-do app', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('https://quickbooks-new.fyleapps.tech/');
  })

  it('displays login buttoon', () => {
    cy.url().should('include', '/dashboard');

    cy.contains('Configuration').click();

    cy.contains('Map Employees').click();

    cy.url().should('include', '/workspaces/main/configuration/employee_settings');

    cy.get('.configuration--form-field').first().click();

    cy.get('.mat-option').contains('Employee').click();
    
    cy.get('.configuration--submit-btn').click();

    // cy.contains('Continue').click();
  })
})
