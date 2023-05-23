/// <reference types="cypress" />

describe('pagination', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.microActionsLogin()
    cy.visit('/')
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Project Mapping')
  })

  function assertCurrentPageNumber(currentPageNumber) {
    cy.get('.paginator--page-info').contains(`Page ${currentPageNumber} of `)
  }

  it('navigate forward / backward / custom', () => {
    assertCurrentPageNumber('1')
    cy.get('.paginator--page-action-box').eq(2).click()

    assertCurrentPageNumber('2')

    cy.get('.paginator--page-action-box').eq(0).click()
    assertCurrentPageNumber('1')

    cy.get('.paginator--page-action-box').eq(1).type('{backspace}')
    cy.get('.paginator--page-action-box').eq(1).type('2')
    assertCurrentPageNumber('2')
  })
})
