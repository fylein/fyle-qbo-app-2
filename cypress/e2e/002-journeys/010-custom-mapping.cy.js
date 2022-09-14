/// <reference types="cypress" />

describe('custom mapping create/view/delete', () => {
  beforeEach(() => {
    cy.ignoreTokenHealth()
    cy.login()
    cy.visit('/')
    cy.navigateToModule('Mappings')
    cy.navigateToMappingPage('Custom Mapping')
  })

  it('Disable Import to Fyle', () => {
    // Disabling Import to Fyle to have sufficient options on Custom Mappings Page
    cy.navigateToModule('Configuration')
    cy.navigateToSettingPage('Import Settings')
    cy.importToFyle(0, false)
    cy.importToFyle(2, false)

    cy.saveSetting('Save')
  })

  function selectCustomMapping(rowNumber, optionName, fieldType) {
    const cssClass = fieldType === 'QBO' ? '.custom-mapping--qbo-field' : '.custom-mapping--fyle-field';
    cy.get('@customMappingRows').find(cssClass).eq(rowNumber).click()
    cy.selectMatOption(optionName)
  }

  function saveAndAssertConfirmationDialog(qbo, fyle, addSectionVisible = true) {
    cy.saveSetting('Create Mapping')

    cy.get('.confirmation-dialog--header-content').contains('Create Custom Mapping')
    cy.get('.confirmation-dialog--info').contains(`You are creating a custom mapping between ${qbo} in QBO and ${fyle} in Fyle.`)

    cy.saveSetting('Save and Continue')

    cy.get('.walk-through-tooltip').should('be.visible')

    cy.get('.walk-through-tooltip--cta').click()

    if (addSectionVisible) {
      cy.get('.custom-mapping--add-section').within(() => {
        cy.get('.actionable-text').click()
      })
    } else {
      cy.get('.custom-mapping--limit-exceeded-text').should('be.visible')
    }
  }

  it('create custom mapping rows', () => {
    cy.wait(['@getMappingSettings', '@getFyleExpenseFields']).then(() => {
      cy.get('.mapping-header-section--card-content-text-count').should('have.text', '0')
      cy.get('.zero-state-with-illustration--zero-state-img-custom-mapping').should('be.visible')
  
      cy.saveSetting('Create Custom Mapping')
  
      cy.get('.custom-mapping--mapping-section').find('div').eq(2).as('customMappingRows')
  
      selectCustomMapping(0, 'Class', 'QBO')

      cy.submitButton().should('have.class', 'btn-disabled')

      selectCustomMapping(0, 'Project', 'Fyle')

      cy.submitButton().should('have.class', 'btn-enabled')

      saveAndAssertConfirmationDialog('Class', 'Project')

      selectCustomMapping(1, 'Department', 'QBO')
      selectCustomMapping(1, 'Cost Center', 'Fyle')
      saveAndAssertConfirmationDialog('Department', 'Cost center')

      selectCustomMapping(2, 'Customer', 'QBO')
      selectCustomMapping(2, 'Xero Team', 'Fyle')
      saveAndAssertConfirmationDialog('Customer', 'Xero team', false)

      cy.get('.mapping-header-section--card-content-text-count').should('have.text', '3')
    })
  })

  it('view custom mapping rows', () => {
    const fixture = {
      0: {
        qbo: 'Class',
        fyle: 'Project'
      },
      1: {
        qbo: 'Department',
        fyle: 'Cost center'
      },
      2: {
        qbo: 'Customer',
        fyle: 'Xero team'
      }
    };
    cy.wait(['@getMappingSettings', '@getFyleExpenseFields']).then(() => {
      cy.get('.custom-mapping--mapping-section').find('div').eq(2).as('customMappingRows')
      cy.get('@customMappingRows').children().each((_, index, __) => {
        cy.get('.custom-mapping--qbo-field').eq(index).should('have.text', fixture[index].qbo)
        cy.get('.custom-mapping--fyle-field').eq(index).should('have.text', fixture[index].fyle)
      })
    })
  })

  it('delete custom mapping rows', () => {
    cy.wait(['@getMappingSettings', '@getFyleExpenseFields']).then(() => {
      cy.wait(500)
      cy.get('.custom-mapping--mapping-section').find('div').eq(2).trigger('mouseenter')
      cy.get('.custom-mapping--delete-section').find('.search-select--clear-icon').click()

      cy.get('.confirmation-dialog--header-content').contains('Delete Custom Mapping')
      cy.get('.confirmation-dialog--info').contains(`You are deleting the custom mapping of Department in QBO to Cost center in Fyle.`)

      cy.saveSetting('Save and Continue')
      cy.get('.mapping-header-section--card-content-text-count').should('have.text', '2')
    })
  })
})
