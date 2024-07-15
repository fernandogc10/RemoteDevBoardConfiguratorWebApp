# RemoteDevBoardConfiguratorWebApp

This web application offers a streamlined and intuitive interface for detecting and managing remote development boards, enabling users to dynamically update configuration parameters in real time.

## Tech Stack

This project utilizes the MEVN stack, comprising the following technologies:

![MongoDB](https://img.icons8.com/color/48/000000/mongodb.png) ![Express.js](https://img.icons8.com/color/48/000000/express-js.png) ![Vue.js](https://img.icons8.com/color/48/000000/vue-js.png) ![Node.js](https://img.icons8.com/color/48/000000/nodejs.png)

- **MongoDB:** A NoSQL database known for its high performance and scalability.
- **Express.js:** A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **Vue.js:** A progressive JavaScript framework used for building user interfaces and single-page applications.
- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine, designed to build scalable network applications.

## Features

- **Real-time Configuration:** Update board parameters dynamically via the web interface.
- **Secure Communication:** Uses MQTT over TLS/SSL for secure message exchange.
- **Scalable Architecture:** Built using Docker Compose for easy setup and scaling.
- **User Authentication:** Basic user authentication for secure access to the configuration interface.
- **Multi-Tenant Support:** Configurable for different boards and users.

## Getting Started

Follow these instructions to get the **RemoteDevBoardConfiguratorWebApp** up and running on your local machine.

### Prerequisites

- **Docker:** [Install Docker](https://docs.docker.com/get-docker/) for your operating system.
- **Docker Compose:** [Install Docker Compose](https://docs.docker.com/compose/install/) for managing multi-container Docker applications.

### Setting Up the Project

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/yourusername/RemoteDevBoardConfiguratorWebApp.git
    cd RemoteDevBoardConfiguratorWebApp
    ```

2. **Prepare the Certificates:**

   Ensure that you have the following certificates in the `certs` directory:

   - `client.crt` – The client certificate for MQTT authentication.
   - `client.key` – The private key corresponding to the client certificate.
   - `localhost.pem` – The SSL certificate for the frontend server.
   - `localhost-key.pem` – The private key for the frontend server SSL certificate.

   You will also need to provide the following files for Mosquitto:

   - `mosquitto-server.crt` – The server certificate for MQTT.
   - `mosquitto-server.key` – The private key for the server certificate.
   - `ca.crt` – The CA certificate for validating the server certificate.
   - `passwordfile` – A file containing MQTT user credentials. 

   Ensure that these files are placed in the correct directories:

   - `certs/` for frontend and client certificates.
   - `mosquitto/` for Mosquitto server certificates and configuration.

3. **Create the Docker Compose File:**

   Use the `docker-compose.yml` file provided to set up and run the Docker containers.
   
5. **Start the Services:**

    Run the following command to start all the services defined in the `docker-compose.yml` file:

    ```bash
    docker-compose up -d
    ```

   This command will build the images (if not already built), create the containers, and start the services in detached mode.

6. **Access the Web Application:**

   After starting the services, you can access the web application at [https://localhost:5173](https://localhost:5173). 

   - **Backend API:** [http://localhost:8080](http://localhost:8080)
   - **MongoDB:** Accessible from the container network on port `27017`
   - **Mosquitto MQTT Broker:** Accessible at `mqtts://localhost:8883` for secure MQTT connections.

## Configuration

### Environment Variables

- **`USERNAME`**: The admin username for the backend. *(default: `admin`)*
- **`PASSWORD`**: The admin password for the backend. *(default: `admin123`)*
- **`MQTT_BROKER_URL`**: The URL for the MQTT broker. *(default: `mqtts://mosquitto:8883`)*
- **`MQTT_CA_CERT_PATH`**: Path to the CA certificate for MQTT. *(default: `/usr/src/app/ca.crt`)*
- **`MQTT_CLIENT_CERT_PATH`**: Path to the client certificate for MQTT. *(default: `/usr/src/app/client.crt`)*
- **`MQTT_CLIENT_KEY_PATH`**: Path to the client key for MQTT. *(default: `/usr/src/app/client.key`)*
- **`MQTT_USERNAME`**: MQTT username for authentication. *(default: `tester`)*
- **`MQTT_PASSWORD`**: MQTT password for authentication. *(default: `1234`)*

### Additional Configuration

If you need to modify the Mosquitto configuration or add more certificates, edit the files in the `./mosquitto` directory:

- **`mosquitto.conf`**: Mosquitto server configuration.
- **`passwordfile`**: File containing MQTT user credentials.
- **`mosquitto-server.crt`**: Server certificate for MQTT.
- **`mosquitto-server.key`**: Private key for the MQTT server certificate.
- **`ca.crt`**: CA certificate for validating the MQTT server certificate.

For frontend SSL/TLS configurations, ensure the `localhost.pem` and `localhost-key.pem` files are in the `./certs` directory.



