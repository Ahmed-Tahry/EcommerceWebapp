# Stage 1: Get statically compiled jq
FROM busybox:glibc as jq-downloader
ADD https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 /jq
RUN chmod +x /jq

# Stage 2: Keycloak
FROM quay.io/keycloak/keycloak:26.2.5
USER root
COPY --from=jq-downloader /jq /usr/bin/jq
COPY entrypoint.sh /opt/keycloak/bin/entrypoint.sh
COPY configure_keycloak_oidc.sh /opt/keycloak/bin/configure_keycloak_oidc.sh
COPY configure_keycloak_roles.sh /opt/keycloak/bin/configure_keycloak_roles.sh
RUN chmod +x /opt/keycloak/bin/*.sh
ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=admin
ENV KC_DB=postgres
ENV KC_DB_URL=jdbc:postgresql://postgres-db:5432/keycloak
ENV KC_DB_USERNAME=keycloakadmin
ENV KC_DB_PASSWORD=StrongPassword123!
ENV KC_DB_SCHEMA=public
ENV KC_HTTP_ENABLED=true
ENV KC_HTTPS_ENABLED=false
ENV KC_HTTP_PORT=8080
ENV KC_HOSTNAME_STRICT=false
ENV KC_HOSTNAME_STRICT_HTTPS=false
EXPOSE 8080