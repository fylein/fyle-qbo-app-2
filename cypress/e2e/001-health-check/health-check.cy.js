/// <reference types="cypress" />

describe('health check app', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads QBO app', () => {
    cy.url().should('include', '/auth/login')
  })

  it('logout from QBO app', () => {
    cy.login()
    cy.reload()

    cy.get('.navbarasd--profile-section').click()
    cy.get('.profile--signout-text').contains('Signout').click()

    cy.url().should('include', '/auth/login')
  })
})
