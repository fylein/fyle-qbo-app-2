describe('Advanced settings', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.microActionsLogin()
    cy.visit('/')
  })

  function assertConfigurationOption(fieldOrder, optionName, click = false, cssClass = '.configuration--form-field') {
    cy.get('.configuration--field-section').eq(fieldOrder).within(() => {
      const field = cy.get(cssClass).should('contain', optionName)
      if (click) {
        field.click()
      }
    })
  }

  function assertConfigurationOption(fieldOrder, optionName, click = false, cssClass = '.configuration--form-field') {
    cy.get('.configuration--field-section').eq(fieldOrder).within(() => {
      const field = cy.get(cssClass).should('contain', optionName)
      if (click) {
        field.click()
      }
    })
  }

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
})