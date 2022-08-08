# fyle-qbo-app
Frontend Repository for Fyle &lt;> Quickbooks Online Integration

### Setup

* Download and install Docker desktop for Mac from [here.](https://www.docker.com/products/docker-desktop)

* If you're using a linux machine, please download docker according to the distrubution you're on.

* Navigate into the root folder

* Copy docker-compose.template.yml as docker-compose.yml and add environment variables

    ```
    cp docker-compose.template.yml docker-compose.yml
    ```

* Setup environment variables in docker_compose.yml

    ```yaml
    environment:
      production: "False"
      FYLE_CLIENT_ID: 
      API_URL: http://localhost:8002/api
      APP_URL: http://localhost:4200
      OLD_QBO_APP_URL: http://localhost:4201/auth/shared_login
      CALLBACK_URI: http://localhost:4200/auth/callback
      QBO_CLIENT_ID: 
      QBO_SCOPE: com.intuit.quickbooks.accounting
      QBO_AUTHORIZE_URI: https://appcenter.intuit.com/connect/oauth2
      QBO_APP_URL: https://app.sandbox.qbo.intuit.com
      SENTRY_DSN: ''
      SENTRY_ENV: ''
      RELEASE: 'local'
      FYLE_APP_URL: https://app.fyle.tech
      TESTS_USER_REFRESH_TOKEN: 
      TESTS_WORKSPACEID: 1
      REFINER_ONBOARDING_DONE_SURVEY_ID: 
      REFINER_EXPORT_DONE_SURVEY_ID: 
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
