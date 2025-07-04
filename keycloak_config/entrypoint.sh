#!/bin/sh
set -e

# Make scripts executable
chmod +x /opt/keycloak/bin/*.sh

# Start Keycloak in the background for configuration
echo "Starting Keycloak in background for configuration..."
/opt/keycloak/bin/kc.sh start-dev &
KEYCLOAK_PID=$!
echo "Keycloak background process PID: $KEYCLOAK_PID"

# Wait for Keycloak to be ready
echo "Waiting for Keycloak to be ready..."
MAX_WAIT=120 # Maximum wait time in seconds (e.g., 2 minutes)
COUNT=0
HEALTH_URL="http://localhost:8080/health/ready"

while [ $COUNT -lt $MAX_WAIT ]; do
    if curl -s --fail $HEALTH_URL > /dev/null; then
        echo "Keycloak is ready."
        break
    fi
    echo "Keycloak not ready yet, waiting... ($COUNT/$MAX_WAIT)"
    sleep 5
    COUNT=$((COUNT + 5))
done

if [ $COUNT -ge $MAX_WAIT ]; then
    echo "Keycloak did not become ready in $MAX_WAIT seconds. Exiting."
    exit 1
fi

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