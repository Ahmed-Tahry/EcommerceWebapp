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
   Once the container is running, you can access the Keycloak admin console.
   - If using HTTP (default before HTTPS configuration): `http://localhost:8080`
   - If HTTPS is configured (see Secure Communication section below): `https://localhost:8443`

## Default Admin Credentials

- **Username:** `admin` (configurable via `KEYCLOAK_ADMIN` in Dockerfile or `docker-compose.yml`)
- **Password:** `admin` (configurable via `KEYCLOAK_ADMIN_PASSWORD` in Dockerfile or `docker-compose.yml`)

You can use these credentials to log in to the Keycloak admin console and start configuring realms, users, and clients.

## Stopping the Container

To stop the Keycloak container, run:
```bash
docker-compose down
```

## Advanced Configuration and Setup Details

This section covers more advanced topics, including securing your deployment with HTTPS, using provided scripts to configure Keycloak, and an example NGINX setup.

### Secure Communication (TLS/HTTPS)

Running Keycloak and your microservices over HTTPS (HTTP Secure, using TLS) is crucial for protecting sensitive data, including user credentials, tokens, and application data, from interception and tampering.

#### 1. Importance of TLS
Transport Layer Security (TLS) encrypts the communication channel between clients (browsers, applications) and your services. Without TLS:
- Passwords and tokens can be stolen.
- Sensitive data exchanged can be read by attackers.
- Data can be modified in transit.
Always use HTTPS in production environments.

#### 2. Keycloak HTTPS Configuration
This project is pre-configured to facilitate HTTPS for Keycloak.

- **`Dockerfile` and `docker-compose.yml` Updates**:
    - The `Dockerfile` uses a modern Keycloak image (`quay.io/keycloak/keycloak`) and sets environment variables (`KC_HTTPS_CERTIFICATE_FILE`, `KC_HTTPS_CERTIFICATE_KEY_FILE`) to enable HTTPS.
    - The `docker-compose.yml` file maps port `8443` for HTTPS and includes a `volumes` section to mount your SSL certificate and private key into the Keycloak container.

- **Provide Your Certificates**:
    - You **must** provide your own SSL certificate (`tls.crt`) and private key (`tls.key`).
    - Place these files in a directory named `certs` at the root of this project (i.e., `./certs/tls.crt` and `./certs/tls.key`).
    - If your certificate and key files are named differently or located elsewhere, update the `volumes` section in `docker-compose.yml` accordingly.
    - For testing/development, you can generate self-signed certificates. An example using OpenSSL is provided in the `docker-compose.yml` comments:
      ```bash
      mkdir certs
      openssl req -x509 -newkey rsa:4096 -keyout certs/tls.key -out certs/tls.crt -days 365 -nodes -subj "/CN=localhost"
      ```
      Remember that browsers will show warnings for self-signed certificates.

- **Keycloak HTTPS Settings**:
    - `KC_PROXY: edge`: Set in `docker-compose.yml`. This setting is important when Keycloak runs behind a reverse proxy (like NGINX or Docker's own networking), ensuring that Keycloak correctly interprets request headers (e.g., `X-Forwarded-For`, `X-Forwarded-Proto`).
    - `KC_HOSTNAME_STRICT_HTTPS: false`: Set in the `Dockerfile` (can be overridden in `docker-compose.yml`). For development, this allows more flexibility with self-signed certificates or when the hostname might not perfectly match. In production, you would typically set this to `true` and configure `KC_HOSTNAME` to your Keycloak's public FQDN.
    - By default, Keycloak will listen on port `8443` for HTTPS. HTTP on port `8080` is also enabled by `KC_HTTP_ENABLED=true` for flexibility during setup, but can be disabled in production.

#### 3. Microservice TLS Configuration
Your Invoice, Email, and Sales Dashboard microservices must also be configured to serve traffic over HTTPS. The specific configuration depends on the technology stack used for each microservice.

- **General Advice**:
    - **Java/Spring Boot**: If your microservices are built with Spring Boot, you can configure the embedded web server (Tomcat, Jetty, or Undertow) for SSL. This typically involves:
        - Obtaining a keystore (e.g., JKS, PKCS12) containing your certificate and private key, or using PEM-formatted certificate and key files directly (supported in newer Spring Boot versions).
        - Configuring properties in `application.properties` or `application.yml` (e.g., `server.ssl.key-store`, `server.ssl.key-alias`, `server.ssl.certificate`, `server.ssl.private-key`).
        - For detailed instructions, refer to the official Spring Boot documentation: [Enabling HTTPS in Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.webserver.configure-ssl) or search for "Spring Boot SSL Configuration".
    - **Other Technologies**: For Node.js, Python/Flask/Django, Go, etc., consult the respective framework's documentation for enabling HTTPS. The principles are similar: provide a certificate and private key, and configure the server to use them.

#### 4. NGINX / API Gateway TLS Configuration (Recommended for Production)
In a production environment, it's common to use a reverse proxy or API Gateway like NGINX in front of Keycloak and your microservices.

- **TLS Termination**: NGINX can be configured as the TLS termination point. This means NGINX handles incoming HTTPS connections from clients, decrypts the traffic, and then can communicate with backend services (Keycloak, microservices) over HTTP or HTTPS.
    - **Benefits**: Centralized SSL/TLS management, simplified configuration for backend services (they might not need to handle TLS directly if on a secure internal network), load balancing, and more.
- **NGINX Configuration**:
    - You would configure NGINX with your SSL certificate and private key.
    - NGINX would then proxy requests to Keycloak (e.g., on port 8080 or 8443) and your microservices.
    - Communication between NGINX and backend services should ideally also be over HTTPS, especially if they are not on an isolated, secure network.
    - For guidance, refer to the NGINX documentation: [NGINX SSL Termination](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) and [NGINX Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/).

#### 5. Certificate Management
Consider how you will obtain and manage your SSL/TLS certificates:

- **Let's Encrypt**: A free, automated, and open Certificate Authority (CA). Excellent for production environments. Tools like Certbot can automate the issuance and renewal of certificates.
- **Self-Signed Certificates**: Suitable for development and testing purposes only. Browsers will display trust warnings. The `openssl` command mentioned earlier creates self-signed certificates.
- **Commercial or Corporate CA**: For enterprise environments, you might obtain certificates from a commercial CA (e.g., DigiCert, Comodo) or an internal corporate CA. These are trusted by default in browsers and operating systems.

Remember to keep your private keys secure and renew your certificates before they expire.

### Automated Keycloak Configuration Scripts

This project includes shell scripts to help automate the configuration of your Keycloak instance. These scripts use `kcadm.sh`, the Keycloak Admin CLI.

**Prerequisites for running the scripts:**
- Keycloak server must be running and accessible.
- `kcadm.sh` must be configured to connect to your Keycloak instance (see script variables).
- `jq` (JSON processor) must be installed if you are running the scripts where `jq` is called (e.g., inside the Keycloak container, ensure it's installed via `apt-get install -y jq` or similar).

**General Usage:**
1.  Make the scripts executable: `chmod +x configure_keycloak_oidc.sh configure_keycloak_roles.sh`
2.  Customize the variables at the top of each script (Keycloak URL, realm name, client details, user credentials, etc.).
3.  Run the scripts. It's often easiest to execute them inside the Keycloak container where `kcadm.sh` is readily available:
    ```bash
    # Example: Copy script to container and execute
    docker cp ./configure_keycloak_oidc.sh <keycloak_container_id_or_name>:/tmp/configure_keycloak_oidc.sh
    docker exec -it <keycloak_container_id_or_name> /tmp/configure_keycloak_oidc.sh

    docker cp ./configure_keycloak_roles.sh <keycloak_container_id_or_name>:/tmp/configure_keycloak_roles.sh
    docker exec -it <keycloak_container_id_or_name> /tmp/configure_keycloak_roles.sh
    ```
    Alternatively, if you have `kcadm.sh` configured locally to point to the Keycloak server, you can run them directly.

#### 1. OAuth2/OpenID Connect Setup (`configure_keycloak_oidc.sh`)
- **Purpose**: This script automates the creation of a Keycloak realm and the registration of OIDC clients for the example microservices (Invoice, Email, Sales Dashboard).
- **Key Actions**:
    - Creates a realm (e.g., `microservices_realm`).
    - Creates OIDC clients with specified client IDs and configurations (standard flow, service accounts where appropriate, redirect URIs).
- **Customization**: Before running, review and update variables like `KEYCLOAK_URL`, `ADMIN_USER`, `ADMIN_PASSWORD`, `REALM_NAME`, client IDs (e.g., `INVOICE_CLIENT_ID`), and `redirectUris`.

#### 2. User Roles and Permissions Setup (`configure_keycloak_roles.sh`)
- **Purpose**: This script sets up basic user roles and creates sample users within the configured realm. It also maps these roles to client scopes so they appear in tokens.
- **Key Actions**:
    - Creates realm-level roles (e.g., `realm_admin`, `customer`).
    - Creates sample users (e.g., `service_admin`, `app_customer`) with initial passwords.
    - Assigns the created realm roles to the sample users.
    - Maps these realm roles to the scopes of the clients created by `configure_keycloak_oidc.sh`, allowing these roles to be included in user tokens.
- **Customization**: Review and update variables for role names, sample usernames, and passwords.
- **Order of Execution**: This script should be run *after* `configure_keycloak_oidc.sh` has successfully completed, as it depends on the realm and clients being present.

### NGINX Reverse Proxy and API Gateway (`nginx.conf.example`)

This project includes an example NGINX configuration file, `nginx.conf.example`, to demonstrate how NGINX can be used as a reverse proxy and API gateway in front of Keycloak and your microservices.

- **Key Features Demonstrated**:
    - **TLS Termination**: Offloading SSL/TLS encryption from backend services to NGINX.
    - **Reverse Proxying**: Forwarding requests to Keycloak (`/auth/`) and example microservice paths (`/invoice/`, `/email/`, `/sales/`).
    - **HTTP to HTTPS Redirection**: Automatically redirecting clients from HTTP to HTTPS.
    - **JWT Validation Guidance**: Comments and examples within the configuration file outline strategies for validating JWTs at the NGINX layer for protected API endpoints. This includes:
        - Using NGINX's `auth_request` module with Keycloak's introspection or UserInfo endpoint.
        - Noting native JWT validation capabilities in NGINX Plus (`auth_jwt`).
        - Mentioning third-party modules for NGINX Open Source (e.g., `lua-resty-openidc`, `ngx_http_auth_jwt_module`).

- **Important – This is a Template**:
    - You **must** customize `nginx.conf.example` for your specific environment.
    - **Update Server Names**: Change `your_domain.com` to your actual domain.
    - **SSL Certificates**: Modify `ssl_certificate` and `ssl_certificate_key` paths to point to your actual certificate files.
    - **Proxy Pass URLs**: Adjust the `proxy_pass` directives to correctly point to your Keycloak instance and microservices (using appropriate hostnames/IPs and ports, or Docker service names if on the same network).
    - **JWT Validation**: Choose and implement a JWT validation strategy suitable for your needs. The example file provides guidance but does not enable a specific validation method by default.

To use this configuration:
1.  Rename it (e.g., to `my_nginx.conf`).
2.  Customize it thoroughly.
3.  Configure NGINX to use your modified configuration file. This might involve placing it in `/etc/nginx/conf.d/` or including it from your main `nginx.conf`.
4.  Ensure NGINX can resolve and access the upstream services (Keycloak, microservices) and has access to the SSL certificate/key.
