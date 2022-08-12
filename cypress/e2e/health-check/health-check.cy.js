/// <reference types="cypress" />

describe('health check app', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads QBO app', () => {
    cy.url().should('include', '/auth/login')
  })
})
