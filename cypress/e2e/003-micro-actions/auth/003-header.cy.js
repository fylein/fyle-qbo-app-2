/// <reference types="cypress" />

describe('header', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.login()
    cy.visit('/')
  })

  function assertPageHeader(pageName) {
    cy.get('.navbar').find('.navbar--page-name-with-back-btn').contains(pageName)
    cy.get('.navbar').find('.navbar--back-btn')
  }

  it('header elements check', () => {
    cy.url().should('include', '/workspaces/main/dashboard')
    cy.get('.navbar--page-name').contains('Dashboard')

    cy.navigateToModule('Export Log')
    assertPageHeader('Export Log')

    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Employee Mapping')
    assertPageHeader('Employee Mapping')

    cy.navigateToMappingPage('Category Mapping')
    assertPageHeader('Category Mapping')

    cy.navigateToMappingPage('Custom Mapping')
    assertPageHeader('Custom Mapping')

    cy.navigateToModule('Configuration')
    cy.navigateToSettingPage('Employee Settings')
    assertPageHeader('Map Employees')

    cy.navigateToModule('Configuration')
    cy.navigateToSettingPage('Export Settings')
    assertPageHeader('Export Settings')
  })

  it('back button to navigate to previous page', () => {
    cy.navigateToModule('Export Log')
    cy.get('.navbar').find('.navbar--back-btn').click()

    cy.url().should('include', '/workspaces/main/dashboard')
  })

  it('help section to have relevant info', () => {
    cy.get('.navbar--help-text').click()

    cy.get('.help--help-center-content').should('include.text', 'Visit Help Centre')
  })

  it('Disconnect QBO dialog', () => {
    cy.get('.navbar--profile-section').click()

    cy.get('.profile--section').contains('Disconnect').click()

    cy.get('.confirmation-dialog--header-content').contains('Disconnect Quickbooks Online')
    cy.get('.confirmation-dialog--info').contains('Exporting expenses from Fyle will no longer work if you disconnect your Quickbooks Online Company.')

    cy.get('.confirmation-dialog--cancel-btn-text').click()
  })
})
