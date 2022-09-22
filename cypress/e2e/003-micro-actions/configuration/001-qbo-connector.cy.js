/// <reference types="cypress" />

describe('auth module', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/workspaces/onboarding/qbo_connector')
  })

  it('loads QBO Conncetor Page', () => {
    cy.get('.qbo-connector--fyle-section-text').should('not.be.null')
    cy.saveSetting('Continue')

    cy.url().should('include', '/workspaces/onboarding/employee_settings')
  })

  it('wrong qbo oauth code redirects to landing page', () => {
    cy.visit('/workspaces/onboarding/qbo_connector?code=xyz&realmId=xyz')

    cy.url().should('include', '/workspaces/onboarding/landing')
  })

  it('show error dialog for different QBO account connection', () => {
    cy.intercept('POST', '**/connect_qbo/authorization_code/', {
      statusCode: 400,
      body: {
        message: 'Please choose the correct QuickBooks Online account'
      }
    })
    cy.visit('/workspaces/onboarding/qbo_connector?code=xyz&realmId=xyz')
    cy.get('.confirmation-dialog--header-content').contains('Incorrect account selected')
    cy.get('.confirmation-dialog--info').contains('You had previously set up the integration with a different QuickBooks Online account. Please choose the same to restore the settings')
  })

  it('disconnect QBO dialog', () => {
    cy.intercept('GET', '**/export_settings/', {
      statusCode: 400,
      body: {
        message: 'Dummy error message'
      }
    })

    cy.intercept('PATCH', '**/credentials/qbo/', {
      statusCode: 200,
      body: {
        message: 'Done'
      }
    })

    cy.reload()

    cy.get('.qbo-connector--switch-org-text').contains('Disconnect').click()
  })
})
