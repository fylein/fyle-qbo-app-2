/// <reference types="cypress" />

describe('resolve qbo error', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.login()
    cy.visit('/')
  })

  it('view failed exports', () => {
    cy.waitForDashboardLoad()
    cy.get('.past-export--row').contains('View').click()

    cy.get('.dashboard-export-log--header-section').contains('Failed Expense Groups')

    // Check if all rows are not null
    cy.get('.export-log-table--row').each(($el, index, $lis) => {
      cy.get('.export-log-table--reference-id').eq(index).contains('C/')
      cy.get('.export-log-table--sub-row').eq(index).should('not.be.null')
      cy.get('.export-log-table--open-in-qbo').eq(index).should('not.be.null')
    })
    cy.get('.dashboard-export-log--close-icon').click()
  })

  it('display failed exports in individual', () => {
    cy.waitForDashboardLoad()
    // Iterate over all QBO errors and compare if the error title matches with Dialog's heading
    cy.get('.errors--qbo-error').each((_, index, __) => {
      cy.get('.errors--qbo-error').find('p').eq(index).then((el) => {
        const errorTitle = el.text()
        cy.get('.errors--qbo-error-short-description').eq(index).as('errorDescription')
        cy.get('.errors--view-expenses').eq(index).contains('View Expenses').click()

        cy.get('.dashboard-export-log--header-section').find('h3').then((dialogHeader) => {
          expect(dialogHeader.text() === errorTitle)
        })
      });

      // Check if all rows are not null
      cy.get('.export-log-child-table--row').each(($el, index, $lis) => {
        cy.get('.export-log-child-table--reference-id').eq(index).contains('E/')
        cy.get('.export-log-table--sub-row').eq(index).should('not.be.null')
        cy.get('.mat-column-fundSource').eq(index + 1).should('not.be.null')
      })
      cy.get('.dashboard-export-log--close-icon').click()
    })
  })

  it('should update Accounts Payable from export settings page and re trigger export', () => {
    cy.waitForDashboardLoad()

    // Update to correct Accounts Payable
    cy.get('.side-nav-bar--module-block-content-expandable').contains('Configuration').click();
    cy.navigateToSettingPage('Export Settings')

    cy.get('.configuration--field-section').eq(2).within(() => {
      cy.get('.configuration--form-field').should('contain', 'Advertising').click()
    })
    cy.selectMatOption('Accounts Payable (A/P)')
    cy.saveSetting('Save')

    // Export
    cy.url().should('include', '/workspaces/main/dashboard')
    cy.wait('@exportableExpenseGroups').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
    cy.submitButton('Export').click()

    cy.wait('@exportsTrigger').its('response.statusCode').should('equal', 200)
    cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
    cy.exportsPolling()
    cy.wait('@getErrors')
    cy.wait('@getPastExport')
  })

  it('should display dashboard with zero state import', () => {
    cy.waitForDashboardLoad()

    cy.get('.export--info-section').contains('Sit back and relax!')
    cy.get('.configuration--submit-btn').should('have.class', 'btn-disabled').contains('Export')

    cy.get('.zero-state-with-illustration--zero-state-img').should('be.visible')

    cy.get('.zero-state-with-illustration--info-section').contains('Congratulations, you are winning!')
  })

  it('view successful exports', () => {
    cy.waitForDashboardLoad()
    cy.get('.past-export--row').contains('View').click()

    cy.get('.dashboard-export-log--header-section').contains('Successful Expense Groups')

    // Check if all rows are not null
    cy.get('.export-log-table--row').each(($el, index, $lis) => {
      cy.get('.export-log-table--reference-id').eq(index).contains('C/')
      cy.get('.export-log-table--sub-row').eq(index).should('not.be.null')
      cy.get('.mat-column-exportType').eq(index + 1).should('not.be.null')
      cy.get('.export-log-table--open-in-qbo').eq(index).should('not.be.null')
    })
    cy.get('.dashboard-export-log--close-icon').click()
  })

  it('triggers refresh dimension', () => {
    cy.waitForDashboardLoad()
    cy.get('.dashboard-header-section--sync-btn').click()
    cy.wait('@refreshDimension').its('response.statusCode').should('equal', 200)
  })
})
