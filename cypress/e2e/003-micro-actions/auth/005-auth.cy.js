/// <reference types="cypress" />

describe('auth module', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
  })

  it('should load auth module', () => {
    cy.visit('/auth')
  })

  it('QBO Token expired', () => {
    cy.intercept('GET', '**/qbo/preferences/', {
      statusCode: 400,
      body: {
        message: 'Dummy error message',
      },
    })
    cy.reload()

    cy.url().should('include', '/workspaces/onboarding/landing')
  })

  it('navigate to workspace guard', () => {
    window.localStorage.removeItem('workspaceId')
    cy.visit('/')
  })
})
