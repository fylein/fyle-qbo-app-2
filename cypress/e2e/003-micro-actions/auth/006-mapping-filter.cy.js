/// <reference types="cypress" />

describe('mapping filter', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.login()
    cy.visit('/')
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Employee Mapping')
  })

  it('simple search', () => {
    cy.wait('@getEmployeeMappings').its('response.statusCode').should('equal', 200)
    cy.get('.search-select--search-input').type('ashwin')

    cy.get('.mapping-table--row').each((_, index, __) => {
      cy.get('.mat-column-fyle').eq(index + 1).contains('ashwin')
    })
  })
})
