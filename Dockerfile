# Use the official Keycloak image as the base image
FROM jboss/keycloak

# Set environment variables
ENV DB_VENDOR=h2
ENV KEYCLOAK_USER=admin
ENV KEYCLOAK_PASSWORD=admin

# Expose port 8080
EXPOSE 8080

# Set the default command to start Keycloak
CMD ["/opt/jboss/keycloak/bin/standalone.sh", "-b", "0.0.0.0"]
