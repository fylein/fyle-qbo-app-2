/// <reference types="cypress" />

describe('onboarding journey', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/qbo/mapping_options/**', { fixture: 'mapping.json' })
    cy.journeyLogin()
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
    cy.get('.configuration--field-toggle-section').eq(0).within(() => {
      cy.enableConfigurationToggle(0)
    })
    cy.get('.mat-checkbox-label').filter(':contains("Other Expense")').click()

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
  }

  function finalAssertion() {
    // Check if user is taken to dashboard page after onboarding is done
    cy.url().should('include', '/workspaces/main/dashboard')
  }

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

  function readExpenseGroupRows() {
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

  function selectCustomMapping(rowNumber, optionName, fieldType) {
    const cssClass = fieldType === 'QBO' ? '.custom-mapping--qbo-field' : '.custom-mapping--fyle-field';
    cy.get('@customMappingRows').find(cssClass).eq(rowNumber).click()
    cy.selectMatOption(optionName)
  }

  function saveAndAssertConfirmationDialog(qbo, fyle, addSectionVisible = true) {
    cy.saveSetting('Create Mapping')

    cy.get('.confirmation-dialog--header-content').contains('Create Custom Mapping')
    cy.get('.confirmation-dialog--info').contains(`You are creating a custom mapping between ${qbo} in QuickBooks Online and ${fyle} in Fyle.`)

    cy.saveSetting('Save and Continue')

    cy.get('.walk-through-tooltip').should('be.visible')

    cy.get('.walk-through-tooltip--cta').click()

    if (addSectionVisible) {
      cy.get('.custom-mapping--add-section').within(() => {
        cy.get('.actionable-text').click()
      })
    } else {
      cy.get('.custom-mapping--limit-exceeded-text').should('be.visible')
    }
  }

  function customMapping() {
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Custom Mapping')

    it('Disable Import to Fyle', () => {
      // Disabling Import to Fyle to have sufficient options on Custom Mappings Page
      cy.navigateToModule('Configuration')
      cy.navigateToSettingPage('Import Settings')
      cy.importToFyle(0, false)
      cy.importToFyle(2, false)
  
      cy.saveSetting('Save')
    })
  
    it('create custom mapping rows', () => {
      cy.wait(['@getMappingSettings', '@getFyleExpenseFields']).then(() => {
        cy.get('.mapping-header-section--card-content-text-count').should('have.text', '0')
        cy.get('.zero-state-with-illustration--zero-state-img-custom-mapping').should('be.visible')
    
        cy.saveSetting('Create Custom Mapping')
    
        cy.get('.custom-mapping--mapping-section').find('div').eq(2).as('customMappingRows')
    
        selectCustomMapping(0, 'Class', 'QBO')
  
        cy.submitButton().should('have.class', 'btn-disabled')
  
        selectCustomMapping(0, 'Cost Center', 'Fyle')
  
        cy.submitButton().should('have.class', 'btn-enabled')
  
        saveAndAssertConfirmationDialog('Class', 'Cost Center')
  
        selectCustomMapping(1, 'Customer', 'QBO')
        selectCustomMapping(1, 'Team', 'Fyle')
        saveAndAssertConfirmationDialog('Customer', 'Team', false)
  
        cy.get('.mapping-header-section--card-content-text-count').should('have.text', '2')
      })
    })
  
    it('view custom mapping rows', () => {
      const fixture = {
        0: {
          qbo: 'Class',
          fyle: 'Cost center'
        },
        1: {
          qbo: 'Customer',
          fyle: 'Team'
        }
      };
      cy.wait(['@getMappingSettings', '@getFyleExpenseFields']).then(() => {
        cy.get('.custom-mapping--mapping-section').find('div').eq(1).as('customMappingRows')
        cy.get('@customMappingRows').children().each((_, index, __) => {
          cy.get('.custom-mapping--qbo-field').eq(index).should('have.text', fixture[index].qbo)
          cy.get('.custom-mapping--fyle-field').eq(index).should('have.text', fixture[index].fyle)
        })
      })
    })
  
    it('delete custom mapping rows', () => {
      cy.wait(['@getMappingSettings', '@getFyleExpenseFields']).then(() => {
        cy.wait(500)
        cy.get('.custom-mapping--mapping-section').find('div').eq(15).trigger('mouseenter')
        cy.get('.custom-mapping--delete-section').find('.search-select--clear-icon').click()
  
        cy.get('.confirmation-dialog--header-content').contains('Delete Custom Mapping')
        cy.get('.confirmation-dialog--info').contains(`You are deleting the custom mapping of Customer in QuickBooks Online to Team in Fyle.`)
  
        cy.saveSetting('Save and Continue')
        cy.get('.mapping-header-section--card-content-text-count').should('have.text', '2')
      })
    })
  }

  it('completes onboarding QBO for a workspace', () => {

    completeEmployeeSettingOnboarding()

    completeExportSettingOnboarding()

    completeImportSettingOnboarding()

    completeAdvancedSettingOnboarding()

    completeOnboarding()

    finalAssertion()

    customMapping()
  })

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

    cy.selectConfigurationField(5, 'Approved')
    cy.selectConfigurationField(6, 'Credit Card Purchase')

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
    assertConfigurationOption(6, 'Select expense export type', true)
    cy.selectMatOption('Journal Entry')
    assertConfigurationOption(9, 'Select the date', true)
    cy.selectMatOption('Last Spend Date')

    cy.saveSetting('Save')
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
    cy.wait('@getMappingOptions').its('response.statusCode').should('equal', 200)

    cy.get('@categoryMappingRow').find('.mapping-table--form-field').click()
    cy.get('.search-select--search-input').eq(1).type('Activity')
    cy.get('.mat-option').contains('Activity').click()
    // TODO: change this 1000ms to proper API interception later
    cy.wait(1000)
  })

  it('update project mapping', () => {
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Project Mapping')
    cy.url().should('include', '/workspaces/main/mapping/project')
    cy.wait('@getMappingOptions').its('response.statusCode').should('equal', 200)

    cy.get('.mapping-table--row').eq(1).as('projectMappingRow')
    cy.get('@projectMappingRow').find('.mat-column-fyle').contains('Aaron Abbott')

    cy.get('@projectMappingRow').find('.mapping-table--form-field').click()
    cy.get('.mat-option').eq(0).click()

  })

  it('should import expenses', () => {
    // Wait for sync import from Fyle to be completed
    cy.wait('@getPastExport').its('response.statusCode').should('equal', 400)
    cy.wait('@getErrors').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
    cy.waitForDashboardLoad()

    // User should be taken to dashboard since they are already onboarded and logged in
    cy.url().should('include', '/workspaces/main/dashboard')

    // Check if exports are ready to be processed
    cy.get('.export--info-text').contains('Click on Export to start exporting expenses from Fyle as QuickBooks Online transactions.')
    cy.get('.zero-state-with-illustration--zero-state-img').should('be.visible')
  })

  it('should export expenses', () => {
    cy.wait('@getPastExport').its('response.statusCode').should('equal', 400)
    cy.wait('@getErrors').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
    cy.waitForDashboardLoad()
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
  })

  it('should resolve mapping error', () => {
    cy.waitForDashboardLoad()
    // Check if past export details and errors are visible
    cy.get('.errors--mapping-error-contents').contains('Employee Mapping errors')

    // Resolve employee mapping error
    cy.get('.errors--mapping-error-contents').contains('Resolve').click()

    cy.wait('@getDestinationAttributes').its('response.statusCode').should('equal', 200)

    cy.get('.dashboard-resolve-mapping-dialog--header-section').should('be.visible')
    cy.get('.dashboard-resolve-mapping-dialog--heading').should('be.visible')
    cy.get('.mat-column-qbo').eq(1).contains('Select Vendor').click()
    cy.selectMatOption('Ashwin')

    cy.wait('@postEmployeeMapping').its('response.statusCode').should('equal', 201)

    cy.get('.dashboard-resolve-mapping-dialog--close-icon').click()
  })

  it('should re-export expenses', () => {
    cy.waitForDashboardLoad()
    cy.submitButton('Export').click()

    cy.wait('@exportsTrigger').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
    cy.exportsPolling()

    // Integration Errors should not be visible since it is resolved
    cy.get('.errors--integration-error-contents').should('not.contain', 'Integration Errors')
  })

  it('view failed exports', () => {
    cy.waitForDashboardLoad()
    cy.get('.past-export--row').last().contains('View').click()

    cy.get('.dashboard-export-log--header-section').contains('Failed Expense Groups')

    // Check if all rows are not null
    cy.get('.export-log-table--row').each(($el, index, $lis) => {
      cy.get('.export-log-table--reference-id').eq(index).contains('C/')
      cy.get('.export-log-table--sub-row').eq(index).should('not.be.null')
      cy.get('.export-log-table--open-in-qbo').eq(index).should('not.be.null')
    })
    cy.get('.dashboard-export-log--close-icon').click()
  })

  it('display failed exports in individual', () => {
    cy.waitForDashboardLoad()
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
  })

  it('should update category mapping and re trigger export', () => {
    cy.waitForDashboardLoad()

    // Update category mapping
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Category Mapping')
    cy.url().should('include', '/workspaces/main/mapping/category')

    cy.get('.mapping-filter--filter-alphabet-list').contains('F').click()
    cy.wait('@getMappings').its('response.statusCode').should('equal', 200)
    cy.wait('@getMappingOptions').its('response.statusCode').should('equal', 200)

    cy.get('.mapping-filter--filter-alphabet-list').as('alphabet')
    cy.get('@alphabet').contains('F').click()

    cy.get('.mapping-table--row').eq(3).as('categoryMappingRow')
    cy.get('@categoryMappingRow').find('.mat-column-fyle').contains('Food')

    cy.get('@categoryMappingRow').find('.mapping-table--form-field').click()
    cy.get('.search-select--search-input').eq(1).type('Advertising')
    cy.wait('@getMappingOptions').its('response.statusCode').should('equal', 200)
    cy.get('.mat-option').contains('Advertising').click()
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
  })

  it('should display dashboard with zero state import', () => {
    cy.waitForDashboardLoad()

    cy.get('.export--info-section').contains('Sit back and relax!')
    cy.get('.configuration--submit-btn').should('have.class', 'btn-disabled').contains('Export')

    cy.get('.zero-state-with-illustration--zero-state-img').should('be.visible')

    cy.get('.zero-state-with-illustration--info-section').contains('Congratulations, you are winning!')
  })

  it('view successful exports', () => {
    cy.waitForDashboardLoad()
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
  })

  it('triggers refresh dimension', () => {
    cy.waitForDashboardLoad()
    cy.get('.dashboard-header-section--sync-btn').click()
    cy.wait('@refreshDimension').its('response.statusCode').should('equal', 200)
  })

  it('view expense groups rows', () => {
    cy.navigateToModule('Export Log')
    cy.wait('@getExpenseGroups').its('response.statusCode').should('equal', 200)
    
    readExpenseGroupRows()
  })

  it('view child expenses', () => {
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
  })

  it('simple text search', () => {
    cy.navigateToModule('Export Log')
    cy.get('.export-settings--search').type('C/')
    expect(cy.get('.export-log-table--row').children.length > 0)

    cy.get('.search-select--clear-icon').click()
    expect(cy.get('.export-log-table--row').children.length > 1)
  })

  it('apply date filter', () => {
    cy.navigateToModule('Export Log')
    cy.get('.export-log--date-filter').eq(0).click()
    cy.selectMatOption('Custom dates')
    cy.get('.mat-calendar-period-button').click()
    cy.get('.mat-calendar-content').contains('2021').click()
    cy.get('.mat-calendar-table').contains('JAN').click()

    cy.get('.mat-calendar-body').contains('1').click()
    cy.get('.mat-calendar-body').contains('9').click()
    cy.get('.export-log--done-text').click()
    cy.wait('@getExpenseGroups').its('response.statusCode').should('equal', 200)

    cy.get('.zero-state-with-illustration--zero-state-text').contains('Sorry, no results found!')
    cy.get('.zero-state-with-illustration--zero-state-text-small').contains('We could not find any exports done on timeline that you have selected')

    cy.get('.export-log--clear-date-filter').click()
    cy.wait('@getExpenseGroups').its('response.statusCode').should('equal', 200)
    expect(cy.get('.export-log-table--row').children.length === 6)
  })

  it('apply date filter for coverage', () => {
    cy.navigateToModule('Export Log')
    cy.get('.export-log--date-filter').eq(0).click()
    cy.selectMatOption('Today')
  })

  it('view expense groups from fixture', () => {
    cy.navigateToModule('Export Log')
    cy.intercept('GET', '**/fyle/expense_groups/**', { fixture: 'export-logs.json' })
    cy.reload()
    readExpenseGroupRows()
  })

})
