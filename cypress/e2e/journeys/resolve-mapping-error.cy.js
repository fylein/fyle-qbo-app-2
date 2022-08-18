/// <reference types="cypress" />

describe('resolve mapping error journey', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.login()
    cy.visit('/')
  })

  function importExpenses() {
    // Wait for sync import from Fyle to be completed
    cy.wait('@synchronousImport').its('response.statusCode').should('equal', 200)
    cy.wait('@exportableExpenseGroups').its('response.statusCode').should('equal', 200)

    // Check if exports are ready to be processed
    cy.get('.export--info-section').contains('Transactions ready to export')
    cy.get('.export--info-text').contains('Click on Export to start exporting expenses from Fyle as QBO transactions.')
    cy.get('.zero-state-with-illustration--zero-state-img').should('be.visible')
  }

  function setupExportsPolling() {
    // Wait till the exports are processed
    cy.wait('@tasksPolling').then((http) => {
      const filteredTasks = http.response.body.results.filter(task => (task.status === 'IN_PROGRESS' || task.status === 'ENQUEUED')).length;

      if (filteredTasks > 0) {
        setupExportsPolling()
      } else {
        assert.equal(filteredTasks, 0, 'All tasks are processed')
      }
    })
  }

  function exportExpenses() {
    cy.submitButton('Export').click()

    // Check if the export is in progress
    cy.get('.configuration--submit-btn').should('have.class', 'btn-disabled').contains('Exporting')
    cy.get('.export--info-text').contains('This may take a few minutes. Please wait...')
    cy.get('.mat-progress-bar-buffer').as('exportProgressBar').should('be.visible')

    cy.wait('@exportsTrigger').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)

    setupExportsPolling()
  }

  function resolveMappingError() {
    // Check if past export details and errors are visible
    cy.get('.past-export--content-section').should('be.visible')
    cy.get('.errors--section').should('be.visible')
    cy.get('.errors--mapping-error-contents').contains('Employee Mapping errors')

    // Resolve employee mapping error
    cy.get('.errors--mapping-error-contents').contains('Resolve').click()

    cy.wait('@getDestinationAttributes').its('response.statusCode').should('equal', 200)

    cy.get('.dashboard-resolve-mapping-dialog--header-section').should('be.visible')
    cy.get('.dashboard-resolve-mapping-dialog--heading').should('be.visible')
    cy.get('.mat-column-qbo').eq(1).contains('Select Vendor').click()
    cy.selectMatOption('Amazon')

    cy.get('.dashboard-resolve-mapping-dialog--close-icon').click()
  }

  function reExportExpenses() {
    cy.get('.errors--resolved-stat').should('be.visible').contains('error(s) resolved')

    cy.submitButton('Export').click()

    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
    setupExportsPolling()

    // Integration Errors should not be visible since it is resolved
    cy.get('.errors--integration-error-contents').should('not.contain', 'Integration Errors')
  }

  it('should resolve mapping error', () => {
    // User should be taken to dashboard since they are already onboarded and logged in
    cy.url().should('include', '/workspaces/main/dashboard')

    importExpenses()

    exportExpenses()

    resolveMappingError()

    reExportExpenses()
  })
})
