describe('Advanced settings', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.microActionsLogin()
    cy.visit('/')
  })

  it('Import QBO field to Fyle', () => {
    cy.navigateToModule('Configuration')
    cy.navigateToSettingPage('Import Settings')
    cy.get('.import-settings--create-custom-field').eq(0).click()

    cy.get('.expense-field-creation-dialog--header-text').contains("Create a new 'Select type' field in Fyle")

    cy.get('.expense-field-creation-dialog--form-input').eq(0).type('Team')
    cy.get('.mat-flat-button').contains('Create & Save').click()
  });

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
});