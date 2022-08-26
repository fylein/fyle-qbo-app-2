/// <reference types="cypress" />

describe('category mapping view/create/update', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.login()
    cy.visit('/')
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Category Mapping')
  })

  it('view category mapping rows', () => {
    cy.get('.mapping-table--row').each((_, index, __) => {
      cy.get('.mat-column-fyle').eq(index + 1).should('not.be.null')
      cy.get('.mat-column-qbo').eq(index + 1).should('not.be.null')
      cy.get('.mat-column-state').eq(index + 1).contains(/Mapped|Unmapped/g)
    })
  })

  it('create category mappings', () => {
    // Number of mappings to be created
    const mappingLimit = 10;

    cy.get('.mapping-header-section--card-content-text-header').contains('Unmapped Categories').click()

    cy.get('.mapping-table--row').each((_, index, __) => {
      cy.get('.mat-column-fyle').eq(index + 1).should('not.be.null')
      cy.get('.mat-column-state').eq(index + 1).contains('Unmapped')

      cy.get('.mapping-table--form-field').eq(index).contains('Select Account').click()

      // Random option number, from 1 -> 70
      cy.get('.mat-option').eq(Math.floor((Math.random() * (70)) + 1)).click()
      cy.get('.mat-column-state').eq(index + 1).contains('Mapped')

      // Stop execution
      if (mappingLimit < index + 2) {
        return false;
      }
    })
  })

  it('update category mappings', () => {
    cy.get('.mapping-table--row').eq(0).as('categoryMappingRow')

    cy.get('@categoryMappingRow').find('.mat-column-fyle').should('not.be.null')
    cy.get('@categoryMappingRow').find('.mat-column-state').contains('Mapped')

    cy.get('@categoryMappingRow').find('.mapping-table--form-field').then((el) => {
      const existingMappingValue = el.text()

      cy.get('@categoryMappingRow').find('.mapping-table--form-field').click()
      // Select 1st option
      cy.get('.mat-option').eq(0).click()

      cy.get('@categoryMappingRow').find('.mapping-table--form-field').should('not.have.text', existingMappingValue)
    })
  })
})
