/// <reference types="cypress" />

describe('page visit across modules', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.login()
    cy.visit('/')
  })

  function navigateToMappingPage(pageName) {
    cy.get('.side-nav-bar--module-block-text-inner').contains(pageName).click();
  }

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
    navigateToMappingPage('Employee Mapping')
    cy.url().should('include', '/workspaces/main/mapping/employee')
  })

  it('loads Category Mappings page', () => {
    cy.navigateToModule('Mappings')
    navigateToMappingPage('Category Mapping')
    cy.url().should('include', '/workspaces/main/mapping/category')
  })

  it('loads Custom Mappings page', () => {
    cy.navigateToModule('Mappings')
    navigateToMappingPage('Custom Mapping')
    cy.url().should('include', '/workspaces/main/mapping/custom')
  })
})
