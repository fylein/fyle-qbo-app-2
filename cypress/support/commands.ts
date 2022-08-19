/// <reference types="cypress" />

import environment from '../../src/environments/environment.json';

declare global {
  namespace Cypress {
    interface Chainable {
      login(): void;
      selectMatOption(optionName: string): void;
      submitButton(content: string): Cypress.Chainable<JQuery<HTMLElement>>;
      saveSetting(content: string): void;
      getMatToggle(toggleIndex: number): void;
      ignoreTokenHealth(): void;
      setupHttpListeners(): void;
    }
  }
}

function setupInterceptor(method: 'GET' | 'POST', url: string, alias: string) {
  cy.intercept({
    method: method,
    url: `**${url}**`,
  }).as(alias);
}

Cypress.Commands.add('login', () => {
  const user = {
    email: 'ashwin.t@fyle.in',
    access_token: 'xyz',
    refresh_token: environment.e2e_tests.refresh_token,
    full_name: 'Ashwin',
    user_id: 'xyz',
    org_id: 'xyz',
    org_name: 'XYZ Org'
  };
  window.localStorage.setItem('user', JSON.stringify(user))
  window.localStorage.setItem('workspaceId', environment.e2e_tests.workspace_id)

  // cy.login() will be used in all tests, hence adding http listener here
  cy.setupHttpListeners();
})

Cypress.Commands.add('setupHttpListeners', () => {
  // This helps cypress to wait for the http requests to complete with 200, regardless of the defaultCommandTimeout (10s)
  // Usage: cy.wait('@getDestinationAttributes').its('response.statusCode').should('equal', 200)

  setupInterceptor('GET', '/qbo/destination_attributes/', 'getDestinationAttributes');

  setupInterceptor('POST', '/fyle/expense_groups/sync/', 'synchronousImport');

  setupInterceptor('GET', '/fyle/exportable_expense_groups/', 'exportableExpenseGroups');

  setupInterceptor('GET', '/tasks/all/', 'tasksPolling');

  setupInterceptor('POST', '/exports/trigger/', 'exportsTrigger');
});

Cypress.Commands.add('selectMatOption', (optionName) => {
  cy.get('mat-option').contains(optionName).click()
})

Cypress.Commands.add('submitButton', (content: string | void) => {
  const button = cy.get('.configuration--submit-btn')
  return content ? button.contains(content) : button
})

Cypress.Commands.add('saveSetting', (content: string) => {
  cy.submitButton(content).click()
})

Cypress.Commands.add('getMatToggle', (toggleIndex: number) => {
  return cy.get('.mat-slide-toggle-bar').eq(toggleIndex)
})

Cypress.Commands.add('ignoreTokenHealth', () => {
  // Intercept this API call to save some time
  cy.intercept('GET', '**/qbo/preferences/', {})
})
