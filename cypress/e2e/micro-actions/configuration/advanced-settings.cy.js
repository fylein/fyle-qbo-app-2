describe('Advanced settings', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.microActionsLogin()
    cy.visit('/')
    cy.navigateToModule('Configuration')
    cy.navigateToSettingPage('Advanced Settings')
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

  function assertAdvancedConfigurationOptionAndUpdate(fieldOrder, optionName, newSelectionOptionName) {
    assertConfigurationOption(fieldOrder, optionName, true, '.configuration--form-field')
    cy.selectMatOption(newSelectionOptionName)
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
  }

  it('add email notification', () => {
    cy.getMatToggle(0).click()
    assertAdvancedConfigurationOptionAndUpdate(0, 'Select Frequency', '6 Hours')

    cy.get('.configuration--form-field').contains('Select Email Address')

    addEmailNotification('Ashwin', 'ashwin.t+hello@fyle.in')
    addEmailNotification('Ashwin 2', 'ashwin.t2+hello@fyle.in')
    addEmailNotification('Ashwin 3', 'ashwin.t3+hello@fyle.in')

    cy.get('.mat-icon-close').click()

    cy.get('.email-multi-select-field--delele-all-icon').click()
  });
});