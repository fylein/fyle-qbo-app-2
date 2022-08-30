/// <reference types="cypress" />

describe('shared login', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
  })

  it('should redirect user back to login page', () => {
    cy.visit('/auth/shared_login?local_storage_dump={"workspaceId": "1"}')
    cy.url().should('include', '/auth/login')
  })
})
