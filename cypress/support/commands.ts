/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(): void;
  }
}

Cypress.Commands.add('login', () => {
  // TODO: window.localStorage.setItem('user', JSON.stringify({"email":"ashwin.t@fyle.in","access_token":"xyz","refresh_token":"xyz","full_name":"Ashwin","user_id":"usqywo0f3nBY","org_id":"orHVw3ikkCxJ","org_name":"Anagha Org"}))
})
