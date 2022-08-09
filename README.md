# fyle-qbo-app
Frontend Repository for Fyle &lt;> Quickbooks Online Integration

### Setup

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
