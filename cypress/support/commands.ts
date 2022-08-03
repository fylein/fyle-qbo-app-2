/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
  interface Chainable {
    login(): void;
  }
}

Cypress.Commands.add('login', () => {
  window.localStorage.setItem('user', JSON.stringify({"email":"ashwin.t@fyle.in","access_token":"xyz","refresh_token":"xyz","full_name":"Ashwin","user_id":"usqywo0f3nBY","org_id":"orHVw3ikkCxJ","org_name":"Anagha Org"}))
})

Cypress.on('uncaught:exception', (err, runnable) => {
  // Don't stop the test execution for 4xx errors
  // TODO: do this only for 4xx errors
  return false
})
