/// <reference types="cypress" />

describe('update configuration', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
  })

  function navigateToSettingPage(pageName) {
    cy.get('.side-nav-bar--module-block-content').contains(pageName).click();
  }

  function assertConfigurationOptionAndUpdate(fieldOrder, optionName, newSelectionOptionName) {
    assertConfigurationOption(fieldOrder, optionName, true)
    cy.selectMatOption(newSelectionOptionName)
  }

  function assertAdvancedConfigurationOptionAndUpdate(fieldOrder, optionName, newSelectionOptionName) {
    assertConfigurationOption(fieldOrder, optionName, true, '.configuration--form-field')
    cy.selectMatOption(newSelectionOptionName)
  }

  function assertAdvancedConfigurationOption(fieldOrder, optionName) {
    assertConfigurationOption(fieldOrder, optionName, false, '.configuration--form-field')
  }

  function assertConfigurationOption(fieldOrder, optionName, click = false, cssClass = '.configuration--form-field') {
    cy.get('.configuration--field-section').eq(fieldOrder).within(() => {
      const field = cy.get(cssClass).should('contain', optionName)
      if (click) {
        field.click()
      }
    })
  }

  function assertConfigurationImportField(fieldOrder, optionName) {
    cy.get('.import-settings--field-toggle-section').eq(fieldOrder).within(() => {
      cy.get('.import-settings--fyle-field').contains(optionName)
    })
  }

  function changeImportFyleField(existingField, newField) {
    cy.get('.import-settings--field-toggle-section').contains(existingField).click()
    cy.selectMatOption(newField)
  }

  function employeeSettingUpdates() {
    navigateToSettingPage('Map Employees')

    // Assert the existing option and update it and save
    assertConfigurationOptionAndUpdate(0, 'Employees', 'Vendors')
    assertConfigurationOptionAndUpdate(1, 'Fyle Name to QBO Display name', 'None')

    cy.saveSetting('Save')

    cy.get('.confirmation-dialog--header-content').contains('Change in Configuration')
    cy.get('.confirmation-dialog--info').contains('You are changing your employee representation from Employee to Vendor')

    cy.saveSetting('Continue')

    // Check if user is taken to export settings page after employee setting form submission
    cy.url().should('include', '/workspaces/main/configuration/export_settings')

    navigateToSettingPage('Map Employees')

    // Assert the existing option
    assertConfigurationOption(0, 'Vendors')
    assertConfigurationOption(1, 'Select representation')
  }

  function exportSettingUpdates() {
    navigateToSettingPage('Export Settings')

    // Reimbursable export should be turned off since Employee mapping is updated to Vendor
    cy.getMatToggle(0).should('not.be.checked')

    // Export them as Bills
    cy.getMatToggle(0).click()
    assertConfigurationOptionAndUpdate(1, 'Select expense export type', 'Bill')
    assertConfigurationOptionAndUpdate(2, 'Select accounts payable', 'Advertising')

    // Toggle off CCC export
    cy.getMatToggle(1).click()

    cy.saveSetting('Save')

    cy.get('.confirmation-dialog--header-content').contains('Change in Configuration')
    cy.get('.confirmation-dialog--info').contains('You have selected a new export type for the reimbursable expense, which would impact a few configurations in the Advanced settings.')

    cy.saveSetting('Continue')

    // Check if user is taken to advanced settings page after export setting form submission
    cy.url().should('include', '/workspaces/main/configuration/advanced_settings')

    navigateToSettingPage('Export Settings')

    // Assert the existing option
    assertConfigurationOption(1, 'Bill')
    assertConfigurationOption(2, 'Advertising')
  }

  function importSettingUpdates() {
    navigateToSettingPage('Import Settings')

    changeImportFyleField('Cost Center', 'Project')

    cy.submitButton().should('have.class', 'btn-disabled')

    changeImportFyleField('Project', 'Cost Center')

    cy.submitButton().should('have.class', 'btn-enabled')

    cy.saveSetting('Save')

    // Check if user is taken to dashboard page after import setting form submission
    cy.url().should('include', '/workspaces/main/dashboard')

    navigateToSettingPage('Import Settings')

    // Assert the existing option
    assertConfigurationImportField(0, 'Project')
    assertConfigurationImportField(2, 'Cost Center')
  }

  function advancedSettingUpdates() {
    navigateToSettingPage('Advanced Settings')

    cy.getMatToggle(1).click()
    assertAdvancedConfigurationOptionAndUpdate(3, 'Select how payments', 'Export Fyle ACH Payments to Quickbooks Online')
    cy.submitButton().should('have.class', 'btn-disabled')
    assertAdvancedConfigurationOptionAndUpdate(4, 'Select a Payment Account', 'Checking')

    cy.submitButton().should('have.class', 'btn-enabled')

    cy.saveSetting('Save')

    // Check if user is taken to dashboard page after advanced setting form submission
    cy.url().should('include', '/workspaces/main/dashboard')

    navigateToSettingPage('Advanced Settings')

    // Assert the saved setting
    assertAdvancedConfigurationOption(3, 'Export Fyle ACH Payments to Quickbooks Online')
    assertAdvancedConfigurationOption(4, 'Checking')
  }

  it('updates configuration for each page', () => {
    // User should be taken to dashboard since they are already onboarded and logged in
    cy.url().should('include', '/workspaces/main/dashboard')

    cy.get('.side-nav-bar--module-block-content-expandable').contains('Configuration').click();

    employeeSettingUpdates()

    exportSettingUpdates()

    importSettingUpdates()

    advancedSettingUpdates()
  })
})
