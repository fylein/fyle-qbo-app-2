/// <reference types="cypress" />

describe('page visit across modules', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.login()
    cy.visit('/')
  })

  it('loads QBO app', () => {
    // User should be taken to dashboard since they are already onboarded and logged in
    cy.url().should('include', '/workspaces/main/dashboard')
  })

  it('loads Export Log page', () => {
    cy.navigateToModule('Export Log')
    cy.url().should('include', '/workspaces/main/export_log')
  })

  it('loads Employee Mappings page', () => {
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Employee Mapping')
    cy.url().should('include', '/workspaces/main/mapping/employee')
  })

  it('loads Category Mappings page', () => {
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Category Mapping')
    cy.url().should('include', '/workspaces/main/mapping/category')
  })

  it('loads Custom Mappings page', () => {
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Custom Mapping')
    cy.url().should('include', '/workspaces/main/mapping/custom')
  })

  it('loads Onboarding landing page', () => {
    cy.visit('/workspaces/onboarding/landing')

    cy.get('.landing--qbo-connect-section')
  })

  it('loads QBO Connector page', () => {
    cy.visit('/workspaces/onboarding/qbo_connector')

    cy.get('.header-section--header-text').contains('Connect to Quickbooks Online')

    cy.saveSetting('Continue')
  })
})
