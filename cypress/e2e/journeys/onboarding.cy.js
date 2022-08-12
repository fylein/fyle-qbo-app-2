/// <reference types="cypress" />

describe('onboarding journey', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
  })

  function selectMatOption(optionName) {
    cy.get('mat-option').contains(optionName).click()
  }

  function enableImportToFyle(fieldOrder, optionName) {
    cy.get('.import-settings--field-toggle-section').eq(fieldOrder).within(() => {
      enableConfigurationToggle(0)
      cy.get('.import-settings--fyle-field').click()
    })
    selectMatOption(optionName)
  }

  function enableConfigurationToggle(fieldOrder) {
    cy.get('.mat-slide-toggle-bar').eq(fieldOrder).click()
  }

  function selectConfigurationField(fieldOrder, optionName) {
    cy.get('.configuration--field-section').eq(fieldOrder).within(() => {
      cy.get('.configuration--form-field').first().click()
    })
    selectMatOption(optionName)
  }

  function proceedToNextStep() {
    cy.get('.configuration--submit-btn').click()
  }

  function completeEmployeeSettingOnboarding() {
    // Check if user is taken to employee settings page after connection
    cy.url().should('include', '/workspaces/onboarding/employee_settings')

    // Select employee setting form values
    selectConfigurationField(0, 'Employee')
    selectConfigurationField(1, 'Fyle Name to QBO Display name')

    proceedToNextStep()
  }

  function completeExportSettingOnboarding() {
    // Check if user is taken to export settings page after employee setting form submission
    cy.url().should('include', '/workspaces/onboarding/export_settings')

    // Select export setting form values
    selectConfigurationField(0, 'Payment Processing')

    // Expand reimbursable expenses section
    enableConfigurationToggle(0)

    selectConfigurationField(1, 'Check')
    selectConfigurationField(2, 'Checking')
    selectConfigurationField(3, 'Report')
    selectConfigurationField(4, 'Current Date')

    // Expand non-reimbursable expenses section
    enableConfigurationToggle(1)
    selectConfigurationField(5, 'Credit Card Purchase')
    selectConfigurationField(6, 'Visa')

    proceedToNextStep()
  }

  function completeImportSettingOnboarding() {
    // Check if user is taken to import settings page after export setting form submission
    cy.url().should('include', '/workspaces/onboarding/import_settings')

    // Select import setting form values
    cy.get('.configuration--field-toggle-section').eq(0).within(() => {
      enableConfigurationToggle(0)
    })
    cy.get('.mat-checkbox-label').filter(':contains("Other Expense")').click()

    enableImportToFyle(0, 'Cost Center')
    enableImportToFyle(2, 'Project')

    proceedToNextStep()
  }

  function completeAdvancedSettingOnboarding() {
    // Check if user is taken to advanced settings page after import setting form submission
    cy.url().should('include', '/workspaces/onboarding/advanced_settings')

    // Select advanced setting form values
    enableConfigurationToggle(1)

    proceedToNextStep()
  }

  function completeOnboarding() {
    // Check if user is taken to onboarding done page after advanced setting form submission
    cy.url().should('include', '/workspaces/onboarding/done')

    cy.get('.configuration--submit-btn').click()
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
