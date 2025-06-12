# Use a modern Keycloak image (Quarkus based)
FROM quay.io/keycloak/keycloak:latest

# Set environment variables for Keycloak admin user
# For Quarkus distribution, these are KEYCLOAK_ADMIN and KEYCLOAK_ADMIN_PASSWORD
ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin

# Set database vendor to H2 (embedded, for development/testing)
# For Quarkus, use KC_DB and related variables. KC_DB=h2 is for embedded H2.
# Using 'dev-file' for KC_DB is also an option for non-production H2.
ENV KC_DB=h2

# --- HTTPS Configuration ---
# Keycloak will look for TLS certificate and key at these paths by default if https is enabled.
# Alternatively, you can specify paths using --https-certificate-file and --https-certificate-key-file.
# For this example, we'll use the arguments in the CMD.
#
# IMPORTANT: You need to provide your own tls.crt and tls.key.
# These files should be mounted into the container at the specified paths.
# Example paths:
# Certificate: /etc/x509/https/tls.crt
# Private Key: /etc/x509/https/tls.key

# Expose HTTPS port
EXPOSE 8443
# Expose HTTP port (optional, Keycloak can redirect or be configured to only use HTTPS)
EXPOSE 8080

# Set the default command to start Keycloak with HTTPS enabled.
# Using kc.sh build first to optimize startup for production is recommended,
# but for simplicity in this example, we'll use 'start-dev' or 'start --optimized'.
# 'start-dev' enables convenient features for development, like easier hot-reloading of themes.
# For a more production-like setup, use 'start --optimized' after running 'kc.sh build'.

# Using 'start' which automatically optimizes on first run if no build is present.
# Adding --proxy edge to handle termination by an external proxy if any.
# Adding --hostname-strict-https=false for easier local testing with self-signed certs,
# but this should ideally be true in production with a proper hostname configuration.
# For now, let's ensure https is enabled.
# We will use KC_HTTPS_CERTIFICATE_FILE and KC_HTTPS_CERTIFICATE_KEY_FILE env vars
ENV KC_HTTPS_CERTIFICATE_FILE=/etc/x509/https/tls.crt
ENV KC_HTTPS_CERTIFICATE_KEY_FILE=/etc/x509/https/tls.key
# Optionally, to enable HTTPS also on port 8080 (not typical, usually 8443 is HTTPS)
# ENV KC_HTTPS_PORT=8080
ENV KC_HTTP_ENABLED=true # Keep HTTP enabled for now for flexibility, can be set to false
ENV KC_HOSTNAME_STRICT_HTTPS=false # For dev, if true, ensure KC_HOSTNAME is set and valid

# The entrypoint is already /opt/keycloak/bin/kc.sh
# CMD ["start-dev", "--https-certificate-file=/etc/x509/https/tls.crt", "--https-certificate-key-file=/etc/x509/https/tls.key"]
# Using environment variables for cert paths is cleaner with kc.sh
CMD ["start-dev"]
