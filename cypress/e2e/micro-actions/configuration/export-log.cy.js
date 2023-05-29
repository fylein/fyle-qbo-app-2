describe('view export log', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.microActionsLogin()
    cy.visit('/')
    cy.navigateToModule('Export Log')
    cy.wait('@getExpenseGroups').its('response.statusCode').should('equal', 200)
  })

  function readExpenseGroupRows() {
    cy.get('.export-log-table--row').each((_, index, __) => {
      if (index < 40) {
        cy.get('.mat-column-exportedAt').eq(index + 1).as('exportedAt')
        cy.get('@exportedAt').find('h4').contains(',').should('not.be.null')
        cy.get('@exportedAt').find('h5').contains(':').should('have.class', 'export-log-table--sub-row')

        cy.get('.mat-column-name').eq(index + 1).as('employee')
        cy.get('@employee').find('h4').should('not.be.null')
        cy.get('@employee').find('h5').contains('@').should('have.class', 'export-log-table--sub-row')

        cy.get('.mat-column-fundSource').eq(index + 1).contains(/Credit Card|Reimbursable/g)

        cy.get('.mat-column-referenceID').eq(index + 1).contains(/C|E|P/)

        cy.get('.mat-column-exportType').eq(index + 1).contains(/Bill|Credit Card Purchase|Check|Journal Entry|Expense/g)

        cy.get('.mat-column-link').eq(index + 1).should('not.be.null')
      }
    })
  }

  it('apply date filter', () => {
    cy.get('.export-log--date-filter').eq(0).click()
    cy.selectMatOption('Custom dates')
    cy.get('.mat-calendar-period-button').click()
    cy.get('.mat-calendar-content').contains('2021').click()
    cy.get('.mat-calendar-table').contains('JAN').click()

    cy.get('.mat-calendar-body').contains('1').click()
    cy.get('.mat-calendar-body').contains('9').click()
    cy.get('.export-log--done-text').click()
    cy.wait('@getExpenseGroups').its('response.statusCode').should('equal', 200)

    cy.get('.zero-state-with-illustration--zero-state-text').contains('Sorry, no results found!')
    cy.get('.zero-state-with-illustration--zero-state-text-small').contains('We could not find any exports done on timeline that you have selected')

    cy.get('.export-log--clear-date-filter').click()
    cy.wait('@getExpenseGroups').its('response.statusCode').should('equal', 200)
    expect(cy.get('.export-log-table--row').children.length === 6)
  })

  it('apply date filter for coverage', () => {
    cy.get('.export-log--date-filter').eq(0).click()
    cy.selectMatOption('Today')
  })

  it('view expense groups from fixture', () => {
    cy.intercept('GET', '**/fyle/expense_groups/**', { fixture: 'export-logs.json' })
    cy.reload()
    readExpenseGroupRows()
  })
})