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
    }
  }
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
})

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
