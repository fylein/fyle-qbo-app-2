/// <reference types="cypress" />

describe('update configuration', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.login()
    cy.visit('/')
  })

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
    cy.navigateToSettingPage('Map Employees')

    // Assert the existing option and update it and save
    assertConfigurationOptionAndUpdate(0, 'Employees', 'Vendors')
    assertConfigurationOptionAndUpdate(1, 'Fyle Name to QBO Display name', 'None')

    cy.saveSetting('Save')

    cy.get('.confirmation-dialog--header-content').contains('Change in Configuration')
    cy.get('.confirmation-dialog--info').contains('You are changing your employee representation from Employee to Vendor')

    cy.saveSetting('Continue')

    // Check if user is taken to export settings page after employee setting form submission
    cy.url().should('include', '/workspaces/main/configuration/export_settings')

    cy.navigateToSettingPage('Map Employees')

    // Assert the existing option
    assertConfigurationOption(0, 'Vendors')
    assertConfigurationOption(1, 'Select representation')
  }

  function exportSettingUpdates() {
    cy.navigateToSettingPage('Export Settings')

    // Reimbursable export should be turned off since Employee mapping is updated to Vendor
    cy.getMatToggle(0).should('not.be.checked')

    // Export them as Bills
    cy.getMatToggle(0).click()
    assertConfigurationOptionAndUpdate(1, 'Select expense export type', 'Bill')
    assertConfigurationOptionAndUpdate(2, 'Select accounts payable', 'Promotional')

    // Toggle off CCC export
    cy.getMatToggle(1).click()

    cy.saveSetting('Save')

    cy.get('.confirmation-dialog--header-content').contains('Change in Configuration')
    cy.get('.confirmation-dialog--info').contains('You have selected a new export type for the reimbursable expense, which would impact a few configurations in the Advanced settings.')

    cy.saveSetting('Continue')

    // Check if user is taken to advanced settings page after export setting form submission
    cy.url().should('include', '/workspaces/main/configuration/advanced_settings')

    cy.navigateToSettingPage('Export Settings')

    // Assert the existing option
    assertConfigurationOption(1, 'Bill')
    assertConfigurationOption(2, 'Promotional')
  }

  function importSettingUpdates() {
    cy.navigateToSettingPage('Import Settings')

    changeImportFyleField('Cost Center', 'Project')

    cy.submitButton().should('have.class', 'btn-disabled')

    changeImportFyleField('Project', 'Cost Center')

    cy.submitButton().should('have.class', 'btn-enabled')

    cy.saveSetting('Save')

    // Check if user is taken to dashboard page after import setting form submission
    cy.url().should('include', '/workspaces/main/dashboard')

    cy.navigateToSettingPage('Import Settings')

    // Assert the existing option
    assertConfigurationImportField(0, 'Cost Center')
    assertConfigurationImportField(2, 'Project')
  }

  function advancedSettingUpdates() {
    cy.navigateToSettingPage('Advanced Settings')

    cy.getMatToggle(1).click()
    assertAdvancedConfigurationOptionAndUpdate(2, 'Select how payments', 'Export Fyle ACH Payments to Quickbooks Online')
    cy.submitButton().should('have.class', 'btn-disabled')
    assertAdvancedConfigurationOptionAndUpdate(3, 'Select a Payment Account', 'Checking')

    cy.submitButton().should('have.class', 'btn-enabled')

    cy.saveSetting('Save')

    // Check if user is taken to dashboard page after advanced setting form submission
    cy.url().should('include', '/workspaces/main/dashboard')

    cy.navigateToSettingPage('Advanced Settings')

    // Assert the saved setting
    assertAdvancedConfigurationOption(2, 'Export Fyle ACH Payments to Quickbooks Online')
    assertAdvancedConfigurationOption(3, 'Checking')
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

  function addEmailNotification(name, email) {
    cy.get('.advanced-settings--span-or').contains('Add new email address').click()

    cy.get('.add-email-dialog--header-text').contains('Add new Email Address')

    cy.get('.add-email-dialog--form-input').as('emailFormInput')

    cy.get('@emailFormInput').eq(0).click()

    cy.get('.add-email-dialog--admin-info').contains('Add an email address').click()

    cy.get('.required-error').contains('Please enter a name')

    cy.get('@emailFormInput').eq(0).type(name)

    cy.get('@emailFormInput').eq(1).type(email)

    cy.get('.mat-flat-button').contains('Save').click()
  }

  it('add email notification', () => {
    cy.navigateToModule('Configuration')
    cy.navigateToSettingPage('Advanced Settings')

    cy.getMatToggle(0).click()
    assertAdvancedConfigurationOptionAndUpdate(0, 'Select Frequency', '6 Hours')

    addEmailNotification('Ashwin', 'ashwin.t+hello@fyle.in')
    addEmailNotification('Ashwin 2', 'ashwin.t+hello2@fyle.in')
    addEmailNotification('Ashwin 3', 'ashwin.t+hello3@fyle.in')

    cy.get('.mat-icon-close').click()

    cy.get('.email-multi-select-field--delele-all-icon').click()
  });

  it('Import QBO field to Fyle', () => {
    cy.navigateToModule('Configuration')
    cy.navigateToSettingPage('Import Settings')

    cy.get('.import-settings--create-custom-field').eq(0).click()

    cy.get('.expense-field-creation-dialog--header-text').contains("Create a new 'Select type' field in Fyle")
  });

  it('preview QBO export', () => {
    cy.navigateToModule('Configuration')
    cy.navigateToSettingPage('Export Settings')

    cy.get('.configuration-select-field--preview-text').eq(0).contains('here').click()

    cy.get('.expense-form-preview--preview-section').should('be.visible')

    cy.get('.expense-form-preview--close-icon').click()

    cy.getMatToggle(1).click()
    cy.selectConfigurationField(5, 'Credit Card Purchase')

    cy.get('.configuration-select-field--preview-text').eq(1).contains('here').click()

    cy.get('.expense-form-preview--preview-section').should('be.visible')
  })
})
