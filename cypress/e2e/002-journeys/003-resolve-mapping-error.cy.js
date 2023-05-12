/// <reference types="cypress" />

describe('resolve mapping error journey', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.login()
    cy.visit('/')
  })

  it('should import expenses', () => {
    // Wait for sync import from Fyle to be completed
    cy.wait('@getPastExport').its('response.statusCode').should('equal', 400)
    cy.wait('@getErrors').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
    cy.waitForDashboardLoad()

    // User should be taken to dashboard since they are already onboarded and logged in
    cy.url().should('include', '/workspaces/main/dashboard')

    // Check if exports are ready to be processed
    cy.get('.export--info-text').contains('Click on Export to start exporting expenses from Fyle as QuickBooks Online transactions.')
    cy.get('.zero-state-with-illustration--zero-state-img').should('be.visible')
  })

  it('should export expenses', () => {
    cy.wait('@getPastExport').its('response.statusCode').should('equal', 400)
    cy.wait('@getErrors').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
    cy.waitForDashboardLoad()
    cy.submitButton('Export').click()

    // Check if the export is in progress
    cy.get('.configuration--submit-btn').should('have.class', 'btn-disabled').contains('Exporting')
    cy.get('.export--info-text').contains('This may take a few minutes. Please wait...')
    cy.get('.mat-progress-bar-buffer').as('exportProgressBar').should('be.visible')

    cy.wait('@exportsTrigger').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)

    cy.exportsPolling()
    cy.wait('@getPastExport')

    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
  })

  it('should resolve mapping error', () => {
    cy.waitForDashboardLoad()
    // Check if past export details and errors are visible
    cy.get('.errors--mapping-error-contents').contains('Employee Mapping errors')

    // Resolve employee mapping error
    cy.get('.errors--mapping-error-contents').contains('Resolve').click()

    cy.wait('@getDestinationAttributes').its('response.statusCode').should('equal', 200)

    cy.get('.dashboard-resolve-mapping-dialog--header-section').should('be.visible')
    cy.get('.dashboard-resolve-mapping-dialog--heading').should('be.visible')
    cy.get('.mat-column-qbo').eq(1).contains('Select Vendor').click()
    cy.selectMatOption('Amazon')

    cy.wait('@postEmployeeMapping').its('response.statusCode').should('equal', 201)

    cy.get('.dashboard-resolve-mapping-dialog--close-icon').click()
  })

  it('should re-export expenses', () => {
    cy.waitForDashboardLoad()
    cy.submitButton('Export').click()

    cy.wait('@exportsTrigger').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
    cy.exportsPolling()

    // Integration Errors should not be visible since it is resolved
    cy.get('app-zero-state-with-illustration').should('not.contain', 'Integration Errors')
  })
})
