# Fyle QBO App
Frontend Repository for Fyle &lt;> Quickbooks Online Integration

## Documentation
Please refer this link to find the [documentation](https://fylein.github.io/fyle-qbo-app-2) of the project.

## Local development setup (Docker Compose)

* Download and install Docker desktop for Mac from [here.](https://www.docker.com/products/docker-desktop)

* If you're using a linux machine, please download docker according to the distrubution you're on.

* Navigate into the root folder

* Copy docker-compose.template.yml as docker-compose.yml and add environment variables wherever needed

    ```
    cp docker-compose.template.yml docker-compose.yml
    ```

* Build docker images

    ```
    docker-compose build
    ```

* Run docker containers

    ```
    docker-compose up -d app
    ```

* To tail the logs a service you can do

    ```
    docker-compose logs -f app
    ```

* To stop the containers

    ```
    docker-compose stop app
    ```

* To restart any containers -

    ```
    docker-compose restart app
    ```

* To run bash inside any container for purpose of debugging or for creating new components, services etc

    ```
    docker-compose exec app /bin/bash
    ```

## Running End to End Tests on local
<b>Note:</b> *For now, Cypress tests runs on local machine and not inside a docker container*

### Setup Org to test
<b>Note:</b> *All the steps mentioned in this section are one time activity*
* It would be very easy if we use this org for running tests since we have pre populated data in Fyle to run tests
    ```
    Email: ashwin.t@fyle.in | Org Name: Fyle For QBO Angular Tests - Github Action
    ```
* Login to this org on [local](http:localhost:4200) once and complete QBO OAuth connection
* Update values for these variables -
    ```
    (copy 1, 2, 3 from local storage and 4 from integrations-central/)
    E2E_TESTS_WORKSPACE_ID:
    E2E_TESTS_ORG_ID:
    E2E_TESTS_REFRESH_TOKEN:
    E2E_TESTS_CLIENT_ID:
    ```
    in docker compose file and
    ```json
    "e2e_tests": {
        "env": "Local",
        "workspace_id": "",
        "refresh_token": "",
        "access_token": "",
        "org_id": "",
        "client_id": ""
    }
    ```
    in `environment.json` (present in `src/environments`)
    <b>Note:</b> *Leave access_token empty*

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
