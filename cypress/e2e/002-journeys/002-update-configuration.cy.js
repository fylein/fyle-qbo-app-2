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
    assertConfigurationOptionAndUpdate(2, 'Select accounts payable', 'Accounts Payable (A/P)')

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
    assertConfigurationOption(2, 'Accounts Payable (A/P)')
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
    // Adding 0.5 wait time at start and end of this function since it is causing some race condition rarely
    cy.wait(500)
    cy.get('.advanced-settings--span-or').contains('Add new email address').click()

    cy.get('.add-email-dialog--header-text').contains('Add new Email Address')

    cy.get('.add-email-dialog--form-input').as('emailFormInput')

    cy.get('@emailFormInput').eq(0).click()

    cy.get('.add-email-dialog--admin-info').contains('Add an email address').click()

    cy.get('.required-error').contains('Please enter a name')

    cy.get('@emailFormInput').eq(0).type(name)

    cy.get('@emailFormInput').eq(1).type(email)

    cy.get('.mat-flat-button').contains('Save').click()
    cy.wait(500)
  }

  it('add email notification', () => {
    cy.navigateToModule('Configuration')
    cy.navigateToSettingPage('Advanced Settings')

    cy.getMatToggle(0).click()
    assertAdvancedConfigurationOptionAndUpdate(0, 'Select Frequency', '6 Hours')

    cy.get('.configuration--form-field').contains('Select Email Address')

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

    cy.get('.expense-field-creation-dialog--form-input').eq(0).type('Team')
    cy.get('.mat-flat-button').contains('Create & Save').click()
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

  it('change expense grouping / export type / API POST error', () => {
    cy.intercept('PUT', '**/export_settings/', {
      statusCode: 400,
      body: {
        message: 'Dummy error message',
      },
    })
    cy.navigateToModule('Configuration')
    cy.navigateToSettingPage('Export Settings')

    assertConfigurationOption(3, 'Report', true)
    cy.selectMatOption('Payment')

    assertConfigurationOption(1, 'Bill', true)
    cy.selectMatOption('Journal Entry')

    cy.enableConfigurationToggle(1)
    cy.enableConfigurationToggle(1)

    cy.enableConfigurationToggle(1)
    assertConfigurationOption(5, 'Select expense export type', true)
    cy.selectMatOption('Journal Entry')
    assertConfigurationOption(8, 'Select the date', true)
    cy.selectMatOption('Last Spend Date')

    cy.enableConfigurationToggle(1)

    cy.saveSetting('Save')
    cy.saveSetting('Continue')
    cy.wait(1000)
  })

  it('preview Fyle expense form', () => {
    cy.navigateToModule('Configuration')
    cy.navigateToSettingPage('Import Settings')

    cy.get('.import-settings--preview-text').eq(0).contains('here').click()

    cy.get('.expense-form-preview--preview-section').should('be.visible')

    cy.get('.expense-form-preview--close-icon').click()
  })

  it('should fail saving import settings', () => {
    cy.intercept('PUT', '**/import_settings/', {
      statusCode: 400,
      body: {
        message: 'Dummy error message',
      },
    })
    cy.navigateToModule('Configuration')
    cy.navigateToSettingPage('Import Settings')

    cy.saveSetting('Save')
  })

  it('update category mapping', () => {
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Category Mapping')
    cy.url().should('include', '/workspaces/main/mapping/category')

    cy.get('.mapping-filter--filter-alphabet-list').contains('F').click()
    cy.wait('@getMappings').its('response.statusCode').should('equal', 200)

    cy.get('.mapping-filter--filter-alphabet-list').as('alphabet')
    cy.get('@alphabet').contains('F').click()

    cy.get('.mapping-table--row').eq(3).as('categoryMappingRow')
    cy.get('@categoryMappingRow').find('.mat-column-fyle').contains('Food')

    cy.get('@categoryMappingRow').find('.mapping-table--form-field').click()
    cy.get('.mat-option').contains('Opening Balance Equity').click()

  })

  it('update project mapping', () => {
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Project Mapping')
    cy.url().should('include', '/workspaces/main/mapping/project')

    cy.get('.mapping-filter--filter-alphabet-list').contains('F').click()
    cy.wait('@getDestinationAttributes').its('response.statusCode').should('equal', 200)

    cy.get('.mapping-table--row').eq(1).as('projectMappingRow')
    cy.get('@projectMappingRow').find('.mat-column-fyle').contains('Aaron Abbott')

    cy.get('@projectMappingRow').find('.mapping-table--form-field').click()
    cy.get('.mat-option').eq(0).click()

  })
})
