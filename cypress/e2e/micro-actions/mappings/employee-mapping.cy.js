/// <reference types="cypress" />

describe('employee mapping view/create/update', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.microActionsLogin()
    cy.visit('/')
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Employee Mapping')
  })

  it('view employee mapping rows', () => {
    const mappingLimit = 10;
    cy.get('.mapping-table--row').each((_, index, __) => {
      cy.get('.mat-column-fyle').eq(index + 1).contains('@')
      cy.get('.mat-column-qbo').eq(index + 1).should('not.be.null')
      cy.get('.mat-column-state').eq(index + 1).contains(/Mapped|Unmapped/g)

      // Stop execution
      if (mappingLimit < index + 2) {
        return false;
      }
    })
  })

  it('create employee mappings', () => {
    // Number of mappings to be created
    const mappingLimit = 2;

    cy.get('.mapping-header-section--card-content-text-header').contains('Unmapped Employees').click()

    cy.get('.mapping-table--row').each((_, index, __) => {
      cy.get('.mat-column-fyle').eq(index + 1).contains('@')
      cy.get('.mat-column-state').eq(index + 1).contains('Unmapped')

      cy.get('.mapping-table--form-field').eq(index).contains('Select Vendor').click()

      // Random option number, from 1 -> 10
      cy.get('.mat-option').eq(Math.floor((Math.random() * (9)) + 1)).click()
      cy.get('.mat-column-state').eq(index + 1).contains('Mapped')

      // Stop execution
      if (mappingLimit < index + 2) {
        return false;
      }
    })
  })

  it('update employee mappings', () => {
    let existingMappingValue = ''
    cy.get('.mapping-table--row').eq(0).as('employeeMappingRow')

    cy.get('@employeeMappingRow').find('.mat-column-fyle').contains('@')
    cy.get('@employeeMappingRow').find('.mat-column-state').contains('Mapped')

    cy.get('@employeeMappingRow').find('.mapping-table--form-field').then((el) => {
      existingMappingValue = el.text()


      cy.get('@employeeMappingRow').find('.mapping-table--form-field').click()
      // Select 1st option
      cy.get('.mat-option').eq(0).click()
    })
    cy.get('@employeeMappingRow').find('.mapping-table--form-field').should('not.have.text', existingMappingValue)
  })

  it('advanced search', () => {
    cy.get('.mapping-table--row').eq(0).as('employeeMappingRow')

    cy.get('@employeeMappingRow').find('.mat-column-fyle').contains('@')
    cy.get('@employeeMappingRow').find('.mat-column-state').contains('Mapped')

    cy.get('@employeeMappingRow').find('.mapping-table--form-field').then((el) => {
      cy.get('@employeeMappingRow').find('.mapping-table--form-field').click()
      cy.get('.search-select--search-input').eq(1).type('ashwin')
      cy.wait('@getQBOVendors').its('response.statusCode').should('equal', 200)
      cy.get('.mat-option').eq(0).contains('Ashwin')
      cy.get('.mat-option').eq(0).click()
    })
    
    cy.get('.mapping-table--form-field').eq(0).contains('Ashwin')
  })

  it('advanced search without data', () => {
    cy.wait('@getQBOVendors').its('response.statusCode').should('equal', 200)
    cy.get('.mapping-table--form-field').eq(0).click()
    cy.get('.search-select--search-input').eq(1).type('ashwinlp')
    cy.get('.mat-option').eq(0).contains('Searching...')
    cy.wait('@getQBOVendors').its('response.statusCode').should('equal', 200)
    cy.get('.mat-option').eq(0).contains('No result found')
    cy.get('.mat-column-fyle').eq(1).click({force: true})
    cy.get('.mapping-table--form-field').eq(0).contains('Select Vendor')
  })
})
