/// <reference types="cypress" />

describe('category mapping view/create/update', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.microActionsLogin()
    cy.visit('/')
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Category Mapping')
  })

  it('view category mapping rows', () => {
    const mappingLimit = 5;
    cy.get('.mapping-table--row').each((_, index, __) => {
      cy.get('.mat-column-fyle').eq(index + 1).should('not.be.null')
      cy.get('.mat-column-qbo').eq(index + 1).should('not.be.null')
      cy.get('.mat-column-state').eq(index + 1).contains(/Mapped|Unmapped/g)

       // Stop execution
       if (mappingLimit < index + 2) {
        return false;
      }
    })
  })

  it('update category mappings', () => {
    let existingMappingValue = '';
    cy.get('.mapping-table--row').eq(0).as('categoryMappingRow')

    cy.get('@categoryMappingRow').find('.mat-column-fyle').should('not.be.null')
    cy.get('@categoryMappingRow').find('.mat-column-state').contains('Mapped')

    cy.get('@categoryMappingRow').find('.mapping-table--form-field').then((el) => {
      existingMappingValue = el.text()

      cy.get('@categoryMappingRow').find('.mapping-table--form-field').click()
      // Select 1st option
      cy.get('.mat-option').eq(0).click()
    })
    cy.get('@categoryMappingRow').find('.mapping-table--form-field').should('not.have.text', existingMappingValue)
  })

  it('advanced search', () => {
    cy.get('.mapping-table--row').eq(0).as('categoryMappingRow')

    cy.get('@categoryMappingRow').find('.mat-column-fyle').should('not.be.null')
    cy.get('@categoryMappingRow').find('.mat-column-state').contains('Mapped')

    cy.get('@categoryMappingRow').find('.mapping-table--form-field').then((el) => {
      cy.get('@categoryMappingRow').find('.mapping-table--form-field').click()
      cy.get('.search-select--search-input').eq(1).type('others')
      cy.wait('@getMappingOptions').its('response.statusCode').should('equal', 200)
      cy.wait(1000)
      cy.get('.mat-option').contains('Others').click()
    })
    cy.get('.mapping-table--form-field').eq(0).contains('Others')
  })

  it('advanced search without data', () => {
    cy.get('.mapping-header-section--card-content-text-header').contains('Unmapped Categories').click()
    cy.wait('@getMappingOptions').its('response.statusCode').should('equal', 200)
    cy.get('.mapping-table--form-field').eq(0).contains('Select Account').click()
    cy.get('.search-select--search-input').eq(1).type('fooopd')
    cy.get('.mat-option').eq(0).contains('Searching...')
    cy.wait('@getMappingOptions').its('response.statusCode').should('equal', 200)
    cy.get('.mat-option').eq(0).contains('No result found')
    cy.get('.mat-column-fyle').eq(1).click({force: true})
    cy.get('.mapping-table--form-field').eq(0).contains('Select Account')
  })
})
