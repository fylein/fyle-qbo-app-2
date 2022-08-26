/// <reference types="cypress" />

describe('generic mapping view/create/update', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.login()
    cy.visit('/')
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Project Mapping')
  })

  it('view project mapping rows', () => {
    cy.get('.mapping-table--row').each((_, index, __) => {
      cy.get('.mat-column-fyle').eq(index + 1).should('not.be.null')
      cy.get('.mat-column-qbo').eq(index + 1).should('not.be.null')
      cy.get('.mat-column-state').eq(index + 1).contains(/Mapped|Unmapped/g)
    })
  })

  it('create project mappings', () => {
    // Number of mappings to be created
    const mappingLimit = 10;

    cy.get('.mapping-header-section--card-content-text-header').contains('Unmapped').click()

    cy.get('.mapping-table--row').each((_, index, __) => {
      cy.get('.mat-column-fyle').eq(index + 1).should('not.be.null')
      cy.get('.mat-column-state').eq(index + 1).contains('Unmapped')

      cy.get('.mapping-table--form-field').eq(index).click()

      // Random option number, from 1 -> 10
      cy.get('.mat-option').eq(Math.floor((Math.random() * (10)) + 1)).click()
      cy.get('.mat-column-state').eq(index + 1).contains('Mapped')

      // Stop execution
      if (mappingLimit < index + 2) {
        return false;
      }
    })
  })

  it('update project mappings', () => {
    cy.get('.mapping-table--row').eq(0).as('projectMappingRow')

    cy.get('@projectMappingRow').find('.mat-column-fyle').should('not.be.null')
    cy.get('@projectMappingRow').find('.mat-column-state').contains('Mapped')

    cy.get('@projectMappingRow').find('.mapping-table--form-field').then((el) => {
      const existingMappingValue = el.text()

      cy.get('@projectMappingRow').find('.mapping-table--form-field').click()
      // Select 1st option
      cy.get('.mat-option').eq(0).click()

      cy.get('@projectMappingRow').find('.mapping-table--form-field').should('not.have.text', existingMappingValue)
    })
  })
})
