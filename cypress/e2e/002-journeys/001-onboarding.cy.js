/// <reference types="cypress" />

describe('onboarding journey', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
  })

  function completeEmployeeSettingOnboarding() {
    // Check if user is taken to employee settings page after connection
    cy.url().should('include', '/workspaces/onboarding/employee_settings')

    // Select employee setting form values
    cy.selectConfigurationField(0, 'Employee')
    cy.selectConfigurationField(1, 'Fyle Name to QBO Display name')

    cy.saveSetting('Save')
  }

  function completeExportSettingOnboarding() {
    // Check if user is taken to export settings page after employee setting form submission
    cy.url().should('include', '/workspaces/onboarding/export_settings')

    // Select export setting form values
    cy.selectConfigurationField(0, 'Payment Processing')

    // Expand reimbursable expenses section
    cy.enableConfigurationToggle(0)

    cy.selectConfigurationField(1, 'Check')
    cy.selectConfigurationField(2, 'Checking')
    cy.selectConfigurationField(3, 'Report')
    cy.selectConfigurationField(4, 'Current Date')

    // Expand non-reimbursable expenses section
    cy.enableConfigurationToggle(1)
    cy.selectConfigurationField(5, 'Credit Card Purchase')
    cy.selectConfigurationField(6, 'Visa')

    cy.saveSetting('Save')
  }

  function completeImportSettingOnboarding() {
    // Check if user is taken to import settings page after export setting form submission
    cy.url().should('include', '/workspaces/onboarding/import_settings')

    // Select import setting form values
    cy.get('.configuration--field-toggle-section').eq(0).within(() => {
      cy.enableConfigurationToggle(0)
    })
    cy.get('.mat-checkbox-label').filter(':contains("Other Expense")').click()

    cy.importToFyle(0, true, 'Cost Center')
    cy.importToFyle(2, true, 'Project')

    cy.saveSetting('Save')
  }

  function completeAdvancedSettingOnboarding() {
    // Check if user is taken to advanced settings page after import setting form submission
    cy.url().should('include', '/workspaces/onboarding/advanced_settings')

    // Select advanced setting form values
    cy.enableConfigurationToggle(1)

    cy.saveSetting('Save')
  }

  function completeOnboarding() {
    // Check if user is taken to onboarding done page after advanced setting form submission
    cy.url().should('include', '/workspaces/onboarding/done')

    cy.saveSetting('Launch Integration')
  }

  function finalAssertion() {
    // Check if user is taken to dashboard page after onboarding is done
    cy.url().should('include', '/workspaces/main/dashboard')
  }

  it('completes onboarding QBO for a workspace', () => {
    completeEmployeeSettingOnboarding()

    completeExportSettingOnboarding()

    completeImportSettingOnboarding()

    completeAdvancedSettingOnboarding()

    completeOnboarding()

    finalAssertion()
  })
})
