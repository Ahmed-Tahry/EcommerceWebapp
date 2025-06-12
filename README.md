# Keycloak Docker Setup

This project provides a simple setup to run Keycloak using Docker and Docker Compose.

## Prerequisites

- Docker
- Docker Compose

## Building and Running the Container

To build and run the Keycloak container, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Build and start the container using Docker Compose:**
   ```bash
   docker-compose up -d
   ```
   This command will build the Docker image (if not already built) and start the Keycloak service in detached mode.

3. **Access Keycloak:**
   Once the container is running, you can access the Keycloak admin console by navigating to `http://localhost:8080` in your web browser.

## Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin`

You can use these credentials to log in to the Keycloak admin console and start configuring realms, users, and clients.

## Stopping the Container

To stop the Keycloak container, run:
```bash
docker-compose down
```
