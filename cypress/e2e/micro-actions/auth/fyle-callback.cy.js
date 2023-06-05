/// <reference types="cypress" />

describe('fyle callback', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
  })

  it('should redirect user back to login page', () => {
    cy.visit('/auth/callback?code=xyz')
    cy.url().should('include', '/auth/login')
  })

  it('should login the user', () => {
    const token = {
      refresh_token: 'xyz',
      access_token: 'xyz',
      expires_in: 3600,
      token_type: 'Bearer',
      user: {
        id:1,
        password:'',
        last_login: null,
        email: 'ashwin.t@fyle.in',
        user_id: 'usqywo0f3nBY',
        full_name: 'Joanna',
        active:true,
        staff:false,
        admin:false,
        org_id: 'orHVw3ikkCxJ',
        org_name: 'Anagha Org'
      }
    };
    cy.intercept('POST', '**/auth/login/', token)
    cy.intercept('POST', '**/auth/refresh/', token)
    cy.intercept('GET', '**/workspaces/?org_id=**', [])
    cy.intercept('GET', '**/credentials/qbo/', {})
    cy.intercept('GET', '**/mappings/settings/', {})
    cy.visit('/auth/callback?code=xyz')

    cy.url().should('include', '/workspaces')
  })
})
