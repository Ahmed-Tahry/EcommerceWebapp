#!/bin/sh
set -e

# Make scripts executable
chmod +x /opt/keycloak/bin/*.sh

# Start Keycloak in the background for configuration
echo "Starting Keycloak in background for configuration..."
/opt/keycloak/bin/kc.sh start-dev &
KEYCLOAK_PID=$!
echo "Keycloak background process PID: $KEYCLOAK_PID"

# Wait for Keycloak to be ready (adjust timeout as needed)
echo "Waiting for Keycloak to be ready..."
sleep 30

# Run configuration scripts
echo "Running configuration scripts..."
/opt/keycloak/bin/configure_keycloak_oidc.sh
/opt/keycloak/bin/configure_keycloak_roles.sh

# Stop the background Keycloak process
echo "Stopping background Keycloak process..."
kill $KEYCLOAK_PID
wait $KEYCLOAK_PID || true  # Allow the process to terminate cleanly

# Start Keycloak in the foreground
echo "Starting Keycloak in the foreground..."
exec /opt/keycloak/bin/kc.sh start-dev