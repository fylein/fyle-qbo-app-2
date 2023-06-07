/// <reference types="cypress" />

describe('generic mapping view/create/update', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.microActionsLogin()
    cy.visit('/')
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Project Mapping')
  })

  it('view project mapping rows', () => {
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

  it('update project mappings', () => {
    let existingMappingValue = ''
    cy.get('.mapping-table--row').eq(0).as('projectMappingRow')

    cy.get('@projectMappingRow').find('.mat-column-fyle').should('not.be.null')
    cy.get('@projectMappingRow').find('.mat-column-state').contains('Mapped')

    cy.get('@projectMappingRow').find('.mapping-table--form-field').then((el) => {
      existingMappingValue = el.text()

      cy.get('@projectMappingRow').find('.mapping-table--form-field').click()
      // Select 1st option
      cy.get('.mat-option').eq(0).click()
    })
    cy.get('@projectMappingRow').find('.mapping-table--form-field').should('not.have.text', existingMappingValue)
  })
})
