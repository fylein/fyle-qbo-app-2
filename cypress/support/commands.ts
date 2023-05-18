// / <reference types="cypress" />

import environment from '../../src/environments/environment.json';

declare global {
  namespace Cypress {
    interface Chainable {
      login(): void;
      selectMatOption(optionName: string): void;
      submitButton(content: string): Cypress.Chainable<JQuery<HTMLElement>>;
      saveSetting(content: string): void;
      getMatToggle(toggleIndex: number): Cypress.Chainable<JQuery<HTMLElement>>;
      ignoreTokenHealth(): void;
      setupHttpListeners(): void;
      navigateToSettingPage(pageName: string): void;
      exportsPolling(): void;
      waitForDashboardLoad(): void;
      interrupt(): void;
      navigateToModule(pageName: string): void;
      navigateToMappingPage(pageName: string): void;
      importToFyle(fieldOrder: number, enable: boolean, optionName: string): void;
      enableConfigurationToggle(fieldOrder: number): void;
      selectConfigurationField(fieldOrder: number, optionName: string): void;
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
    access_token: environment.e2e_tests.access_token,
    refresh_token: environment.e2e_tests.refresh_token,
    full_name: 'Ashwin',
    user_id: 'xyz',
    org_id: environment.e2e_tests.org_id,
    org_name: 'XYZ Org'
  };
  window.localStorage.setItem('user', JSON.stringify(user));
  window.localStorage.setItem('workspaceId', environment.e2e_tests.workspace_id);

  // Cy.login() will be used in all tests, hence adding http listener here
  cy.setupHttpListeners();
});

Cypress.Commands.add('setupHttpListeners', () => {
  // This helps cypress to wait for the http requests to complete with 200, regardless of the defaultCommandTimeout (10s)
  // Usage: cy.wait('@getDestinationAttributes').its('response.statusCode').should('equal', 200)
  cy.intercept('POST', '**/refresh_dimensions', {}).as('refreshDimension');

  setupInterceptor('GET', '/qbo/destination_attributes/', 'getDestinationAttributes');

  setupInterceptor('POST', '/fyle/expense_groups/sync', 'synchronousImport');

  setupInterceptor('GET', '/fyle/exportable_expense_groups', 'exportableExpenseGroups');

  setupInterceptor('GET', '/tasks/all/', 'tasksPolling');

  setupInterceptor('POST', '/exports/trigger', 'exportsTrigger');

  setupInterceptor('POST', '/mappings/employee', 'postEmployeeMapping');

  setupInterceptor('GET', '/errors/', 'getErrors');

  setupInterceptor('GET', '/export_detail', 'getPastExport');

  setupInterceptor('GET', '/fyle/expense_groups/', 'getExpenseGroups');

  setupInterceptor('GET', '/mappings/settings', 'getMappingSettings');

  setupInterceptor('GET', '/mappings/expense_attributes/', 'getMappings');

  setupInterceptor('GET', '/fyle/expense_fields', 'getFyleExpenseFields');

  setupInterceptor('GET', '/mappings/employee_attributes/', 'getEmployeeMappings');

  setupInterceptor('GET', '/qbo/vendors/', 'getQBOVendors');

  setupInterceptor('GET', '/qbo/mapping_options/', 'getMappingOptions');
});

Cypress.Commands.add('selectMatOption', (optionName) => {
  cy.get('mat-option').contains(optionName).click();
});

Cypress.Commands.add('submitButton', (content: string | void) => {
  const button = cy.get('.configuration--submit-btn');
  return content ? button.contains(content) : button;
});

Cypress.Commands.add('saveSetting', (content: string) => {
  cy.submitButton(content).click();
});

Cypress.Commands.add('getMatToggle', (toggleIndex: number) => {
  return cy.get('.mat-slide-toggle-bar').eq(toggleIndex);
});

Cypress.Commands.add('ignoreTokenHealth', () => {
  // Intercept this API call to save some time
  cy.intercept('GET', '**/qbo/preferences/', {});
});

Cypress.Commands.add('navigateToSettingPage', (pageName: string) => {
  cy.get('.side-nav-bar--module-block-content').contains(pageName).click();
});

Cypress.Commands.add('exportsPolling', () => {
  // Wait till the exports are processed
  cy.wait('@tasksPolling').its('response.body').then((body) => {
    const filteredTasks = body.results.filter(function (task: any) {
      return task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED';
    });
    if (filteredTasks.length > 0) {
          cy.exportsPolling();
        } else {
          assert.equal(filteredTasks.length, 0, 'All tasks are processed');
        }
  });
});

Cypress.Commands.add('waitForDashboardLoad', () => {
  cy.wait('@synchronousImport').its('response.statusCode').should('equal', 200);
  cy.wait('@exportableExpenseGroups').its('response.statusCode').should('equal', 200);
});

Cypress.Commands.add('navigateToModule', (pageName: string) => {
  cy.get('.side-nav-bar--module-block-text').contains(pageName).click();
});

Cypress.Commands.add('navigateToMappingPage', (pageName: string) => {
  cy.get('.side-nav-bar--module-block-text-inner').contains(pageName).click();
});

Cypress.Commands.add('importToFyle', (fieldOrder: number, enable: boolean, optionName: string = '') => {
  cy.get('.import-settings--field-toggle-section').eq(fieldOrder).within(() => {
    cy.enableConfigurationToggle(0);
    if (enable) {
      cy.get('.import-settings--fyle-field').click();
    }
  });
  if (enable) {
    cy.selectMatOption(optionName);
  }
});

Cypress.Commands.add('enableConfigurationToggle', (fieldOrder: number) => {
  cy.getMatToggle(fieldOrder).click();
});

Cypress.Commands.add('selectConfigurationField', (fieldOrder: number, optionName: string) => {
  cy.get('.configuration--field-section').eq(fieldOrder).within(() => {
    cy.get('.configuration--form-field').first().click();
  });
  cy.selectMatOption(optionName);
});
