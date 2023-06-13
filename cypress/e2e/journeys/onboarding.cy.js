/// <reference types="cypress" />

describe('onboarding journey', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/qbo/mapping_options/**', { fixture: 'mapping.json' })
    cy.journeyLogin()
    cy.visit('/')
  })


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


  function completeEmployeeSettingOnboarding() {
    // Check if user is taken to employee settings page after connection
    cy.url().should('include', '/workspaces/onboarding/employee_settings')

    // Select employee setting form values
    cy.selectConfigurationField(0, 'Vendor')
    cy.selectConfigurationField(1, 'None')

    // Assert the existing option
    assertConfigurationOption(0, 'Vendors')
    assertConfigurationOption(1, 'Select representation')

    cy.saveSetting('Save')

  }

  function completeExportSettingOnboarding() {
    // Check if user is taken to export settings page after employee setting form submission
    cy.url().should('include', '/workspaces/onboarding/export_settings')

    // Expand reimbursable expenses section
    cy.enableConfigurationToggle(0)
    cy.selectConfigurationField(0, 'Processing')
    cy.selectConfigurationField(1, 'Bill')
    cy.selectConfigurationField(2, 'Accounts Payable (A/P)')
    cy.selectConfigurationField(3, 'Report')
    cy.selectConfigurationField(4, 'Current Date')

    // Expand non-reimbursable expenses section
    cy.enableConfigurationToggle(1)
    cy.selectConfigurationField(5, 'Approved')
    cy.selectConfigurationField(6, 'Credit Card Purchase')
    cy.selectConfigurationField(7, 'Visa')

    // Assert the existing option
    assertConfigurationOption(1, 'Bill')
    assertConfigurationOption(2, 'Accounts Payable (A/P)')
    assertConfigurationOption(6, 'Credit Card Purchase')
    assertConfigurationOption(7, 'Visa')

    cy.saveSetting('Save')
  }

  function completeImportSettingOnboarding() {
    // Check if user is taken to import settings page after export setting form submission
    cy.url().should('include', '/workspaces/onboarding/import_settings')

    // Select import setting form values

    cy.importToFyle(0, true, 'Cost Center')
    cy.importToFyle(2, true, 'Project')

    // Assert the existing option
    assertConfigurationImportField(0, 'Cost Center')
    assertConfigurationImportField(2, 'Project')

    cy.saveSetting('Save')
  }

  function completeAdvancedSettingOnboarding() {
    // Check if user is taken to advanced settings page after import setting form submission
    cy.url().should('include', '/workspaces/onboarding/advanced_settings')

    // Select advanced setting form values
    cy.enableConfigurationToggle(1)

    cy.getMatToggle(1).click()
    cy.selectConfigurationField(2, 'Export Fyle ACH Payments to QuickBooks Online')
    cy.submitButton().should('have.class', 'btn-disabled')
    cy.selectConfigurationField(3, 'Checking')

    cy.submitButton().should('have.class', 'btn-enabled')

    // Assert the saved setting
    assertAdvancedConfigurationOption(2, 'Export Fyle ACH Payments to QuickBooks Online')
    assertAdvancedConfigurationOption(3, 'Checking')

    cy.saveSetting('Save')
  }

  function completeOnboarding() {
    // Check if user is taken to onboarding done page after advanced setting form submission
    cy.url().should('include', '/workspaces/onboarding/done')

    cy.saveSetting('Launch Integration')

    cy.url().should('include', '/workspaces/main/dashboard')
  }

  function readExpenseGroupRows() {
    cy.navigateToModule('Export Log')
    cy.get('.export-log-table--row').each((_, index, __) => {
      if (index < 40) {
        cy.get('.mat-column-exportedAt').eq(index + 1).as('exportedAt')
        cy.get('@exportedAt').find('h4').contains(',').should('not.be.null')
        cy.get('@exportedAt').find('h5').contains(':').should('have.class', 'export-log-table--sub-row')

        cy.get('.mat-column-name').eq(index + 1).as('employee')
        cy.get('@employee').find('h4').should('not.be.null')
        cy.get('@employee').find('h5').contains('@').should('have.class', 'export-log-table--sub-row')

        cy.get('.mat-column-fundSource').eq(index + 1).contains(/Credit Card|Reimbursable/g)

        cy.get('.mat-column-referenceID').eq(index + 1).contains(/C|E|P/)

        cy.get('.mat-column-exportType').eq(index + 1).contains(/Bill|Credit Card Purchase|Check|Journal Entry|Expense/g)

        cy.get('.mat-column-link').eq(index + 1).should('not.be.null')
      }
    })
  }

  function updateCategoryMapping() {
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Category Mapping')
    cy.url().should('include', '/workspaces/main/mapping/category')

    cy.get('.mapping-filter--filter-alphabet-list').contains('F').click()
    cy.wait('@getMappings').its('response.statusCode').should('equal', 200)

    cy.get('.mapping-filter--filter-alphabet-list').as('alphabet')
    cy.get('@alphabet').contains('F').click()

    cy.get('.mapping-table--row').eq(3).as('categoryMappingRow')
    cy.get('@categoryMappingRow').find('.mat-column-fyle').contains('Food')
    cy.wait('@getMappingOptions').its('response.statusCode').should('equal', 200)

    cy.get('@categoryMappingRow').find('.mapping-table--form-field').click()
    cy.get('.search-select--search-input').eq(1).type('Activity')
    cy.get('.mat-option').contains('Activity').click()
    // TODO: change this 1000ms to proper API interception later
    cy.navigateToModule('Mappings')
  }

  function importExpenses() {
    cy.navigateToModule('Dashboard')
    cy.waitForDashboardLoad()
    cy.url().should('include', '/workspaces/main/dashboard')
    // Wait for sync import from Fyle to be completed
    cy.wait('@getPastExport').its('response.statusCode').should('equal', 400)
    cy.wait('@getErrors').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
    cy.wait(1000)
    // Check if exports are ready to be processed
    cy.get('.export--info-text').contains('Click on Export to start exporting expenses from Fyle as QuickBooks Online transactions.')
    cy.get('.zero-state-with-illustration--zero-state-img').should('be.visible')
  }

  function exportExpenses() {
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
  }

  function resolveMappingError() {
    // Check if past export details and errors are visible
    cy.get('.errors--mapping-error-contents').contains('Employee Mapping errors')

    // Resolve employee mapping error
    cy.get('.errors--mapping-error-contents').contains('Resolve').click()

    cy.wait('@getDestinationAttributes').its('response.statusCode').should('equal', 200)

    cy.get('.dashboard-resolve-mapping-dialog--header-section').should('be.visible')
    cy.get('.dashboard-resolve-mapping-dialog--heading').should('be.visible')
    cy.wait(900)
    cy.get('.mat-column-qbo').eq(1).contains('Select Vendor').click()
    cy.selectMatOption('Amazon')

    cy.wait('@postEmployeeMapping').its('response.statusCode').should('equal', 201)

    cy.get('.dashboard-resolve-mapping-dialog--close-icon').click()
  }

  function reExportExpense() {

    cy.submitButton('Export').click()

    cy.wait('@exportsTrigger').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
    cy.exportsPolling()

    // Integration Errors should not be visible since it is resolved
    cy.get('.errors--integration-error-contents').should('not.contain', 'Integration Errors')
  }

  function viewFailedExports() {
    cy.get('.past-export--row').last().contains('View').click()

    cy.get('.dashboard-export-log--header-section').contains('Failed Expense Groups')

    // Check if all rows are not null
    cy.get('.export-log-table--row').each(($el, index, $lis) => {
      cy.get('.export-log-table--reference-id').eq(index).contains('C/')
      cy.get('.export-log-table--sub-row').eq(index).should('not.be.null')
      cy.get('.export-log-table--open-in-qbo').eq(index).should('not.be.null')
    })
    cy.get('.dashboard-export-log--close-icon').click()
  }

  function displayFailedExports() {
    // Iterate over all QBO errors and compare if the error title matches with Dialog's heading
    cy.get('.errors--qbo-error').each((_, index, __) => {
      cy.get('.errors--qbo-error').find('p').eq(index).then((el) => {
        const errorTitle = el.text()
        cy.get('.errors--qbo-error-short-description').eq(index).as('errorDescription')
        cy.get('.errors--view-expenses').eq(index).contains('View Expenses').click()

        cy.get('.dashboard-export-log--header-section').find('h3').then((dialogHeader) => {
          expect(dialogHeader.text() === errorTitle)
        })
      });

      // Check if all rows are not null
      cy.get('.export-log-child-table--row').each(($el, index, $lis) => {
        cy.get('.export-log-child-table--reference-id').eq(index).contains('E/')
        cy.get('.export-log-table--sub-row').eq(index).should('not.be.null')
        cy.get('.mat-column-fundSource').eq(index + 1).should('not.be.null')
      })
      cy.get('.dashboard-export-log--close-icon').click()
    })
  }

  function updateCategoryMappingandTriggerExport() {

    // Update category mapping
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Category Mapping')
    cy.url().should('include', '/workspaces/main/mapping/category')

    cy.wait(1500)
    cy.get('.mapping-filter--filter-alphabet-list').contains('F').click()
    cy.wait('@getMappings').its('response.statusCode').should('equal', 200)
    cy.wait('@getMappingOptions').its('response.statusCode').should('equal', 200)

    cy.get('.mapping-table--row').eq(3).as('categoryMappingRow')
    cy.get('@categoryMappingRow').find('.mat-column-fyle').contains('Food')

    cy.get('@categoryMappingRow').find('.mapping-table--form-field').click()
    cy.get('.search-select--search-input').eq(1).type('&')
    cy.wait('@getMappingOptions').its('response.statusCode').should('equal', 200)
    cy.wait(1500)
    cy.get('.mat-option').eq(1).click()
    cy.navigateToModule('Dashboard')
    // Export
    cy.url().should('include', '/workspaces/main/dashboard')
    cy.wait('@exportableExpenseGroups').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
    cy.submitButton('Export').click()

    cy.wait('@exportsTrigger').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
    cy.exportsPolling()
    cy.wait('@getErrors')
    cy.wait('@getPastExport')
  }

  function dashboardWithZeroStateError() {

    cy.get('.export--info-section').contains('Sit back and relax!')
    cy.get('.configuration--submit-btn').should('have.class', 'btn-disabled').contains('Export')

    cy.get('.zero-state-with-illustration--zero-state-img').should('be.visible')

    cy.get('.zero-state-with-illustration--info-section').contains('Congratulations, you are winning!')
  }

  function viewSuccessfulExports() {

    cy.get('.past-export--row').contains('View').click()

    cy.get('.dashboard-export-log--header-section').contains('Successful Expense Groups')

    // Check if all rows are not null
    cy.get('.export-log-table--row').each(($el, index, $lis) => {
      cy.get('.export-log-table--reference-id').eq(index).contains('C/')
      cy.get('.export-log-table--sub-row').eq(index).should('not.be.null')
      cy.get('.mat-column-exportType').eq(index + 1).should('not.be.null')
      cy.get('.export-log-table--open-in-qbo').eq(index).should('not.be.null')
    })
    cy.get('.dashboard-export-log--close-icon').click()
  }

  function viewExpenseGroupsRows() {
    cy.navigateToModule('Export Log')
    cy.wait('@getExpenseGroups').its('response.statusCode').should('equal', 200)
    
    readExpenseGroupRows()
  }

  function viewChildExpenses() {
    cy.navigateToModule('Export Log')
    cy.get('.export-log-table--row').each((_, index, __) => {
      cy.get('.mat-column-exportedAt').eq(index + 1).as('exportedAt').click()

      cy.get('.export-log-child-table--row').each(($el, index, $lis) => {
        cy.get('.mat-column-expenseID').eq(index + 1).contains('E/')
        cy.get('.mat-column-merchant').eq(index + 1).should('not.be.null')
        cy.get('.mat-column-category').eq(index + 1).should('not.be.null')
        cy.get('.mat-column-amount').eq(index + 1).should('not.be.null')
      })
      cy.get('.export-log-child-dialog--close-icon').click()
    })
  }
  
  it('completes onboarding QBO for a workspace', () => {

    completeEmployeeSettingOnboarding()

    completeExportSettingOnboarding()

    completeImportSettingOnboarding()

    completeAdvancedSettingOnboarding()

    completeOnboarding()

    updateCategoryMapping()

    importExpenses()

    exportExpenses()

    resolveMappingError()

    reExportExpense()

    viewFailedExports()

    displayFailedExports()

    updateCategoryMappingandTriggerExport()

    dashboardWithZeroStateError()

    viewSuccessfulExports()

    viewExpenseGroupsRows()

    viewChildExpenses()

  })

})
