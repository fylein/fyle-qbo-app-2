/// <reference types="cypress" />

describe('logout', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.visit('/')
  })

  it('logout the user', () => {
    cy.visit('/auth/logout')
    cy.url().should('include', '/auth/login')
  })
})
