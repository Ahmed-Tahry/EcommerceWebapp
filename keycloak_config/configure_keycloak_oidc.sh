#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration Variables ---
# For kcadm.sh running inside this container, always target localhost
KCADM_TARGET_URL="http://localhost:8080"
ADMIN_USER="${KEYCLOAK_ADMIN_USER:-admin}"
ADMIN_PASSWORD="${KEYCLOAK_ADMIN_PASSWORD:-admin}" # Default password - CHANGE IN PRODUCTION & USE ENV VARS
REALM_NAME="myapp-realm"

# New Client Configuration
MYAPP_API_CLIENT_ID="myapp-api"
# Common redirect URIs for development and production. Add more as needed.
# Using "http://localhost:*" as a wildcard for local development on any port.
MYAPP_API_REDIRECT_URIS='["http://localhost:8080/myapp/callback", "http://localhost:3000/callback", "https://myapp.com/callback", "http://localhost:*/callback", "http://127.0.0.1:*/callback"]'
MYAPP_API_WEB_ORIGINS='["http://localhost:8080", "http://localhost:3000", "https://myapp.com", "http://localhost:*", "http://127.0.0.1:*"]'

# Old Client IDs to be deleted
OLD_INVOICE_CLIENT_ID="invoice_service"
OLD_EMAIL_CLIENT_ID="email_service"
OLD_SALES_CLIENT_ID="sales_dashboard_service"

# Path to Keycloak Admin CLI (kcadm.sh)
KCADM_CMD="/opt/keycloak/bin/kcadm.sh"
# If kcadm.sh is in PATH and keycloak is local, this might work:
# KCADM_CMD="kcadm.sh"

echo "--- Starting Keycloak OIDC Configuration for realm '$REALM_NAME' ---"
echo "Admin CLI Target URL: $KCADM_TARGET_URL"
echo "Target Realm: $REALM_NAME"
echo "Target Client ID: $MYAPP_API_CLIENT_ID"

# --- 1. Login to Keycloak Admin CLI ---
echo "Attempting to log in to Keycloak ($KCADM_TARGET_URL) as admin user '$ADMIN_USER'..."
$KCADM_CMD config credentials --server "$KCADM_TARGET_URL" --realm master --user "$ADMIN_USER" --password "$ADMIN_PASSWORD"
echo "Admin login successful."

# --- 2. Create or Update Realm ---
echo "Checking if realm '$REALM_NAME' already exists..."
if $KCADM_CMD get realms/"$REALM_NAME" > /dev/null 2>&1; then
  echo "Realm '$REALM_NAME' already exists. Updating token settings..."
  $KCADM_CMD update realms/"$REALM_NAME" \
    -s accessTokenLifespan=900 \
    -s ssoSessionIdleTimeout=3600 \
    -s ssoSessionMaxLifespan=3600
  echo "Realm '$REALM_NAME' token settings updated."
else
  echo "Creating realm '$REALM_NAME' with token settings..."
  $KCADM_CMD create realms -s realm="$REALM_NAME" -s enabled=true \
    -s accessTokenLifespan=900 \
    -s ssoSessionIdleTimeout=3600 \
    -s ssoSessionMaxLifespan=3600
  echo "Realm '$REALM_NAME' created successfully with token settings."
fi

# --- 3. Delete Old Clients (if they exist) ---
echo "Checking and deleting old clients..."
OLD_CLIENT_IDS_TO_DELETE=("$OLD_INVOICE_CLIENT_ID" "$OLD_EMAIL_CLIENT_ID" "$OLD_SALES_CLIENT_ID")
for OLD_CLIENT_ID in "${OLD_CLIENT_IDS_TO_DELETE[@]}"; do
  # Check if client exists by clientId
  CLIENT_KC_INTERNAL_ID=$($KCADM_CMD get clients -r "$REALM_NAME" -q clientId="$OLD_CLIENT_ID" --fields id --format csv --noquotes)
  if [ -n "$CLIENT_KC_INTERNAL_ID" ]; then
    echo "Deleting old client '$OLD_CLIENT_ID' (Internal ID: $CLIENT_KC_INTERNAL_ID) from realm '$REALM_NAME'..."
    $KCADM_CMD delete clients/"$CLIENT_KC_INTERNAL_ID" -r "$REALM_NAME"
    echo "Old client '$OLD_CLIENT_ID' deleted."
  else
    echo "Old client '$OLD_CLIENT_ID' does not exist in realm '$REALM_NAME'. Skipping deletion."
  fi
done

# --- 4. Create or Update OIDC Client for myapp-api ---
echo "Checking and creating/updating OIDC client '$MYAPP_API_CLIENT_ID'..."
CLIENT_KC_INTERNAL_ID=$($KCADM_CMD get clients -r "$REALM_NAME" -q clientId="$MYAPP_API_CLIENT_ID" --fields id --format csv --noquotes)

CLIENT_CONFIG_ARGS=(
  -s clientId="$MYAPP_API_CLIENT_ID"
  -s name="My App API Client"
  -s description="Public OIDC client for My App API with PKCE"
  -s enabled=true
  -s protocol=openid-connect
  -s publicClient=true
  -s standardFlowEnabled=true  # Authorization Code Flow
  -s implicitFlowEnabled=false # Disable Implicit Flow for public clients using PKCE
  -s directAccessGrantsEnabled=true # Disable Password Grant unless explicitly needed
  -s serviceAccountsEnabled=false # Not typically needed for a public client
  -s frontchannelLogout=true # Recommended for public clients
  -s "redirectUris=$MYAPP_API_REDIRECT_URIS"
  -s "webOrigins=$MYAPP_API_WEB_ORIGINS"
  #-s pkceCodeChallengeMethod=S256 # Enable PKCE with S256 method
)

if [ -n "$CLIENT_KC_INTERNAL_ID" ]; then
    echo "Client '$MYAPP_API_CLIENT_ID' already exists (Internal ID: $CLIENT_KC_INTERNAL_ID). Updating configuration..."
    $KCADM_CMD update clients/"$CLIENT_KC_INTERNAL_ID" -r "$REALM_NAME" "${CLIENT_CONFIG_ARGS[@]}"
    echo "Client '$MYAPP_API_CLIENT_ID' updated."
else
    echo "Creating client '$MYAPP_API_CLIENT_ID'..."
    $KCADM_CMD create clients -r "$REALM_NAME" "${CLIENT_CONFIG_ARGS[@]}"
    echo "Client '$MYAPP_API_CLIENT_ID' created."
fi

# Note on Role Claims:
# The `configure_keycloak_roles.sh` script maps realm roles (admin, tier-1, etc.)
# to this client's scope. This typically makes them available in the `realm_access.roles`
# claim of the JWT. If a custom claim (e.g., "roles") is needed, additional protocol mappers
# would be configured for the '$MYAPP_API_CLIENT_ID' client. For now, default behavior is assumed.

# --- 5. Logout (Optional) ---
# echo "Logging out from Keycloak Admin CLI..."
# $KCADM_CMD config credentials --server "$KEYCLOAK_URL" --realm master # Clears current session
# echo "Admin logout successful."

echo "--- Keycloak OIDC Configuration Script for realm '$REALM_NAME' Finished ---"
echo "Review the output above for any errors or warnings."
echo "Ensure this script is executable: chmod +x $(basename "$0")"
echo "This script should be run to set up the '$REALM_NAME' realm and the '$MYAPP_API_CLIENT_ID' client."
echo "Run 'configure_keycloak_roles.sh' after this script to set up roles and users."
echo "IMPORTANT: Review and change default admin passwords if this is for a production environment!"
echo "Consider managing secrets like passwords through environment variables or a secrets manager."
