# Keycloak Docker Setup

This project provides a setup to run Keycloak using Docker and Docker Compose, along with example configurations for integrating it with microservices and an NGINX API gateway.

## Project Structure

This repository is organized into several key directories:

-   **`keycloak_config/`**: Contains the `Dockerfile` for building the Keycloak image (with HTTPS support) and shell scripts (`configure_keycloak_oidc.sh`, `configure_keycloak_roles.sh`) for automating Keycloak realm setup, client registration, and role configuration.
-   **`nginx_api_gateway/`**: Holds the `nginx.conf.example`, an example NGINX configuration for acting as a reverse proxy, handling TLS termination, and providing guidance on JWT validation for securing APIs.
-   **`invoice_service/`**: Placeholder directory for the Invoice microservice code and its specific configurations.
-   **`email_service/`**: Placeholder directory for the Email microservice code and its specific configurations.
-   **`sales_dashboard_service/`**: Placeholder directory for the Sales Dashboard microservice code and its specific configurations.
-   **`shared_config/`**: Intended for any configuration files, scripts, or resources that might be shared across multiple microservices.
-   **`certs/`**: This directory (you'll need to create it) is the recommended location to place your SSL/TLS certificate (`tls.crt`) and private key (`tls.key`) when enabling HTTPS for Keycloak (via `docker-compose.yml`) or NGINX.
-   `docker-compose.yml`: The main Docker Compose file to orchestrate the Keycloak container.
-   `README.md`: This main README file.

Each of these directories (where applicable) contains its own `README.md` file with more specific details about its contents and purpose.

## Prerequisites

-   Docker
-   Docker Compose

## Building and Running the Keycloak Container

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Prepare SSL Certificates (for HTTPS):**
    If you plan to enable HTTPS (recommended, and configured by default in the examples):
    - Create a `certs` directory in the project root: `mkdir certs`
    - Place your SSL certificate (`tls.crt`) and private key (`tls.key`) into the `./certs/` directory.
    - For development/testing, you can generate self-signed certificates as described in the "Secure Communication (TLS/HTTPS)" section.

3.  **Build and start the Keycloak container using Docker Compose:**
    ```bash
    docker-compose up -d
    ```
    This command will build the Keycloak Docker image using the `Dockerfile` located in `keycloak_config/` and start the Keycloak service in detached mode.

4.  **Access Keycloak:**
    Once the container is running, you can access the Keycloak admin console:
    -   If HTTPS is configured (default): `https://localhost:8443`
    -   If you've reverted to HTTP: `http://localhost:8080`

## Default Admin Credentials

-   **Username:** `admin` (configurable via `KEYCLOAK_ADMIN` in `keycloak_config/Dockerfile` or `docker-compose.yml`)
-   **Password:** `admin` (configurable via `KEYCLOAK_ADMIN_PASSWORD` in `keycloak_config/Dockerfile` or `docker-compose.yml`)

You can use these credentials to log in to the Keycloak admin console to start configuring realms, users, and clients manually, or use the provided scripts for automation.

## Stopping the Keycloak Container

To stop the Keycloak container and remove the network defined in `docker-compose.yml`:
```bash
docker-compose down
```

## Advanced Configuration and Setup Details

This section covers more advanced topics, including securing your deployment with HTTPS, using provided scripts to configure Keycloak, and an example NGINX setup.

### Secure Communication (TLS/HTTPS)

Running Keycloak and your microservices over HTTPS (HTTP Secure, using TLS) is crucial for protecting sensitive data.

#### 1. Importance of TLS
(Content remains the same as previous version)
Transport Layer Security (TLS) encrypts the communication channel between clients (browsers, applications) and your services. Without TLS:
- Passwords and tokens can be stolen.
- Sensitive data exchanged can be read by attackers.
- Data can be modified in transit.
Always use HTTPS in production environments.

#### 2. Keycloak HTTPS Configuration
This project's Keycloak setup is pre-configured to facilitate HTTPS.

-   **`Dockerfile` and `docker-compose.yml` Integration**:
    -   The `keycloak_config/Dockerfile` uses a modern Keycloak image (`quay.io/keycloak/keycloak`) and sets environment variables (`KC_HTTPS_CERTIFICATE_FILE`, `KC_HTTPS_CERTIFICATE_KEY_FILE`) to enable HTTPS by pointing to `/etc/x509/https/tls.crt` and `/etc/x509/https/tls.key` within the container.
    -   The root `docker-compose.yml` file maps port `8443` for HTTPS and includes a `volumes` section to mount your SSL certificate and private key from `./certs/tls.crt` and `./certs/tls.key` on the host into the Keycloak container at the expected paths.

-   **Provide Your Certificates (in `./certs/`)**:
    -   You **must** provide your own SSL certificate (`tls.crt`) and private key (`tls.key`).
    -   Place these files in the `./certs/` directory at the root of this project.
    -   If your certificate and key files are named differently or located elsewhere, update the `volumes` section in `docker-compose.yml` accordingly.
    -   For testing/development, you can generate self-signed certificates:
        ```bash
        mkdir certs # If not already created
        openssl req -x509 -newkey rsa:4096 -keyout certs/tls.key -out certs/tls.crt -days 365 -nodes -subj "/CN=localhost"
        ```
        Browsers will show warnings for self-signed certificates.

-   **Keycloak HTTPS Settings (in `keycloak_config/Dockerfile`)**:
    -   `KC_PROXY: edge`: Set in `docker-compose.yml`. Important when Keycloak runs behind a reverse proxy.
    -   `KC_HOSTNAME_STRICT_HTTPS: false`: Default in the Dockerfile for easier development. In production, set to `true` and configure `KC_HOSTNAME`.
    -   Keycloak listens on port `8443` for HTTPS. HTTP on `8080` is also enabled via `KC_HTTP_ENABLED=true`.

#### 3. Microservice TLS Configuration
(Content remains similar, emphasizing general guidance)
Your Invoice, Email, and Sales Dashboard microservices must also be configured to serve traffic over HTTPS. ...

#### 4. NGINX / API Gateway TLS Configuration (Recommended for Production)
(Content remains similar, emphasizing general guidance)
In a production environment, it's common to use a reverse proxy or API Gateway like NGINX ... The `nginx_api_gateway/nginx.conf.example` provides a starting point.

#### 5. Certificate Management
(Content remains the same as previous version)
Consider how you will obtain and manage your SSL/TLS certificates: Let's Encrypt, Self-Signed Certificates, Commercial or Corporate CA. ...

### Automated Keycloak Configuration Scripts

This project includes shell scripts located in the `keycloak_config/` directory to help automate the configuration of your Keycloak instance. These scripts use `kcadm.sh`, the Keycloak Admin CLI.

**Prerequisites for running the scripts:**
-   Keycloak server must be running and accessible.
-   `kcadm.sh` must be available and configured. The scripts assume it's in the PATH or use a defined variable.
-   `jq` (JSON processor) must be installed if running scripts that use it (like `configure_keycloak_roles.sh`). For execution inside the Keycloak container, ensure `jq` is installed (e.g., `apt-get update && apt-get install -y jq`).

**General Usage:**
1.  Navigate to the `keycloak_config/` directory: `cd keycloak_config`
2.  Make the scripts executable: `chmod +x configure_keycloak_oidc.sh configure_keycloak_roles.sh`
3.  Customize the variables at the top of each script.
4.  Run the scripts. It's often easiest to execute them inside the Keycloak container:
    ```bash
    # Example: Copy scripts from keycloak_config to container and execute
    docker cp ./keycloak_config/configure_keycloak_oidc.sh <keycloak_container_id_or_name>:/tmp/configure_keycloak_oidc.sh
    docker exec -it <keycloak_container_id_or_name> /tmp/configure_keycloak_oidc.sh

    docker cp ./keycloak_config/configure_keycloak_roles.sh <keycloak_container_id_or_name>:/tmp/configure_keycloak_roles.sh
    docker exec -it <keycloak_container_id_or_name> /tmp/configure_keycloak_roles.sh
    ```
    Alternatively, if `kcadm.sh` is configured locally, you can run them directly from the `keycloak_config/` directory.

#### 1. OAuth2/OpenID Connect Setup (`keycloak_config/configure_keycloak_oidc.sh`)
-   **Purpose**: Automates Keycloak realm creation and OIDC client registration for microservices.
-   **Key Actions**: Creates a realm, OIDC clients with specified configurations.
-   **Customization**: Update variables in the script (Keycloak URL, admin credentials, realm name, client IDs, redirect URIs).

#### 2. User Roles and Permissions Setup (`keycloak_config/configure_keycloak_roles.sh`)
-   **Purpose**: Sets up user roles, creates sample users, and maps roles to client scopes.
-   **Key Actions**: Creates realm roles, sample users, assigns roles, maps roles to client scopes.
-   **Customization**: Update variables for role names, sample user credentials.
-   **Order of Execution**: Run *after* `configure_keycloak_oidc.sh`.

### NGINX Reverse Proxy and API Gateway (`nginx_api_gateway/nginx.conf.example`)

The `nginx_api_gateway/` directory contains an example NGINX configuration file, `nginx.conf.example`. This file demonstrates how NGINX can serve as a reverse proxy and API gateway.

-   **Key Features Demonstrated**: TLS Termination, Reverse Proxying (Keycloak & microservices), HTTP to HTTPS Redirection, JWT Validation Guidance.
-   **Important – This is a Template**:
    -   You **must** customize `nginx_api_gateway/nginx.conf.example` for your environment.
    -   Update server names, SSL certificate paths, `proxy_pass` URLs.
    -   Choose and implement a JWT validation strategy.

To use this configuration:
1.  Copy or link `nginx_api_gateway/nginx.conf.example` to your NGINX configuration directory (e.g., `/etc/nginx/conf.d/my_app.conf`).
2.  Customize it thoroughly.
3.  Ensure NGINX can access necessary resources (certs, upstream services) and reload its configuration.
