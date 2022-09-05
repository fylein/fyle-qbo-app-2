# Fyle QBO App
Frontend Repository for Fyle &lt;> Quickbooks Online Integration

## Documentation
Please refer this link to find the [documentation](https://fylein.github.io/fyle-qbo-app-2) of the project.

## Local development setup

* Copy `environment.json` from integrations-central/ and add it to `src/environments`

    ```bash
    cp ../fyle-integrations-central/app-secrets/qbo-2/environment.json src/environments/environment.json
    ```

* Run app

    ```bash
    npm start
    ```

## Running End to End Tests on local
### Setup Org to test
<b>Note:</b> *All the steps mentioned in this section are one time activity*
* It would be very easy if we use this org for running tests since we have pre populated data in Fyle to run tests
    ```
    Email: ashwin.t@fyle.in | Org Name: Fyle For QBO Angular Tests - Github Action
    ```
* Login to this org on [local](http:localhost:4200) once and complete QBO OAuth connection
* Update values for these variables in `e2e_tests` key in `environment.json` (present in `src/environments`) -
<b>*(Copy all these values from local storage)*</b>
    ```
        "workspace_id": "",
        "refresh_token": "",
        "org_id": ""
    ```

* Create an sql function to partially setup an org to run tests -
    ```bash
    # bash into database
    \i ../fyle-qbo-api/sql/functions/e2e-test-setup-workspace-local.sql;
    ```

* Partially reset the org using the sql script we created -
    ```sql
    select reset_workspace_e2e(<workspace_id_goes_here>);
    ```
### Helper commands
* Make sure the app and api is up and running
* To open Cypress UI and run end to end test spec wise, use this command -
    ```bash
    npm run cypress_open
    ```
    <b>Note</b>: *Running this command will decrease the code coverage since we run 1 test at a time*

* To run all end to end tests and update code coverage, use this command -
    ```bash
    npm run cypress_run
    ```
    <b>Note</b>: *Running this command will update the code coverage*
*This step is highly recommended when you write a new end to end test*
* To reset the org to initial data, use the `reset_workspace_e2e()` sql function and re run tests

### Bonus points
* Execute tests in the folder and files in a sequence as it present.
    For example, if we try to run `cypress/e2e/002-journeys/002-update-configuration.cy.js` initially without running `cypress/e2e/002-journeys/001-onboarding.cy.js`, the test will fail.
* Name the test file in the sequence followed and place them in the right folder. Cypress tests gets executed in an alphabetical manner, as of now.
* If we are writing a test that represent an user journey, create the test in the journey folder. Or if it represents a micro action, place it in the micro-actions folder. If we add a new feature and wanted to cover all possible scenarios to write a test, add it to the feature folder, along with month and year.

### End to End Tests on Github
* End to End tests runs on all PRs, after the PR is approved. Only if all tests pass, contributor will be able to merge it to master. This happens against the staging environment. We'll receive a comment in the PR about the run status and code coverage summary.
* End to End tests against production environment will run every Tuesday and Thursday at 2pm.
* Manually if we wanted to trigger end to end tests, we can make use of manual [github action](https://github.com/fylein/fyle-qbo-app-2/actions/workflows/manual-e2e.yml) and run it against Staging/Production environment with the specified branch.
* Once the tests are completed, we'll receive a message on slack with the summary and screen recordings incase the test fails.

*For more detailed notes, please to check the Notion doc about End to End Tests on QBO App*
