/// <reference types="cypress" />

describe('mapping filter', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.microActionsLogin()
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

  it('alphabet filter', () => {
    cy.wait('@getEmployeeMappings').its('response.statusCode').should('equal', 200)
    cy.get('.mapping-filter--filter-alphabet-list').as('alphabet')
    cy.get('@alphabet').contains('O').click()

    cy.get('.mapping-table--row').each((_, index, __) => {
      cy.get('.mat-column-fyle').eq(index + 1).contains(/o|O/g)
    })
  })
})
