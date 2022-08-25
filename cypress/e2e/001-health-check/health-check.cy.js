/// <reference types="cypress" />

describe('health check app', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads QBO app', () => {
    cy.url().should('include', '/auth/login')
  })

  it('login to QBO app', () => {
    cy.login()
    cy.reload()
    cy.url().should('include', '/workspaces/onboarding/employee_settings').then(() => {
      const user = JSON.parse(window.localStorage.getItem('user'));
      cy.storeAccessToken(user.access_token)
    })
  })
})
