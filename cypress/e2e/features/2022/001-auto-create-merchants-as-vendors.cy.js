/// <reference types="cypress" />

describe('auto create vendor', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.login()
    cy.visit('/')
    cy.navigateToModule('Configuration')
  })


  it('Enable Import Vendors from QuickBooks Online', () => {
    cy.navigateToSettingPage('Import Settings')
    cy.get('app-configuration-toggle-field').eq(1).within(() => {
      cy.enableConfigurationToggle(0)
    })
    cy.saveSetting('Save')
    cy.saveSetting('Continue')

    cy.navigateToSettingPage('Advanced Settings')
    cy.get('.advanced-settings').should('not.contain', 'Auto-create Merchants as Vendors')

  })


  it('Make Auto-create QBO Vendors visible', () => {
    cy.navigateToSettingPage('Import Settings')
    cy.get('app-configuration-toggle-field').eq(1).within(() => {
      cy.enableConfigurationToggle(0)
    })
    cy.saveSetting('Save')
    cy.url().should('include', '/workspaces/main/dashboard')

    cy.navigateToSettingPage('Export Settings')
    cy.selectConfigurationField(5, 'Bill')
    cy.saveSetting('Save')
    cy.url().should('include', '/workspaces/main/dashboard')

    cy.navigateToSettingPage('Advanced Settings')
    cy.get('.advanced-settings').should('not.contain', 'Auto-create Merchants as Vendors')

    cy.navigateToSettingPage('Export Settings')
    cy.selectConfigurationField(5, 'Credit Card Purchase')
    cy.saveSetting('Save')
    cy.url().should('include', '/workspaces/main/dashboard')

    cy.navigateToSettingPage('Advanced Settings')
    cy.get('app-configuration-toggle-field').eq(2).within(() => {
      cy.getMatToggle(0).should('be.visible')
    })
  })


  it('Enable Auto-create QBO Vendors', () => {
    cy.navigateToSettingPage('Advanced Settings')
    cy.get('app-configuration-toggle-field').eq(2).within(() => {
      cy.getMatToggle(0).click()
    })
    cy.saveSetting('Save')

    cy.waitForDashboardLoad()
    cy.submitButton('Export').click()
  })
})