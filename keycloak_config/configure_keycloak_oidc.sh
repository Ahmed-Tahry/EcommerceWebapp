#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration Variables ---
# TODO: Update these placeholder values with your actual configuration.
KEYCLOAK_URL="http://localhost:8080"
ADMIN_USER="admin"
ADMIN_PASSWORD="admin" # Default password, change in production!
REALM_NAME="microservices_realm"

INVOICE_CLIENT_ID="invoice_service"
EMAIL_CLIENT_ID="email_service"
SALES_CLIENT_ID="sales_dashboard_service"

# These URIs are examples and should match your microservices' actual redirect URI configurations.
INVOICE_REDIRECT_URI="http://localhost:8081/login/oauth2/code/keycloak"
EMAIL_REDIRECT_URI="http://localhost:8082/login/oauth2/code/keycloak"
SALES_REDIRECT_URI="http://localhost:8083/login/oauth2/code/keycloak" # For a UI application

# Path to Keycloak Admin CLI (kcadm.sh)
# Assumes kcadm.sh is in the PATH or the Keycloak bin directory.
# If Keycloak is running in Docker, you might need to execute this script
# inside the container or adjust kcadm.sh path accordingly.
KCADM_CMD="kcadm.sh" # Or "/opt/jboss/keycloak/bin/kcadm.sh" if inside the official container

echo "--- Starting Keycloak OIDC Configuration ---"

# --- 1. Login to Keycloak Admin CLI ---
echo "Attempting to log in to Keycloak as admin..."
$KCADM_CMD config credentials --server $KEYCLOAK_URL --realm master --user $ADMIN_USER --password $ADMIN_PASSWORD
echo "Login successful."

# --- 2. Create New Realm ---
echo "Checking if realm '$REALM_NAME' already exists..."
if $KCADM_CMD get realms/$REALM_NAME > /dev/null 2>&1; then
  echo "Realm '$REALM_NAME' already exists. Skipping creation."
else
  echo "Creating realm '$REALM_NAME'..."
  $KCADM_CMD create realms -s realm=$REALM_NAME -s enabled=true
  echo "Realm '$REALM_NAME' created successfully."
fi

# --- 3. Create OIDC Client for Invoice Microservice ---
echo "Creating OIDC client for Invoice microservice ('$INVOICE_CLIENT_ID')..."
# Check if client already exists
INVOICE_CLIENT_KC_ID=$($KCADM_CMD get clients -r $REALM_NAME --fields id,clientId | jq -r ".[] | select(.clientId==\"$INVOICE_CLIENT_ID\") | .id")

if [ -n "$INVOICE_CLIENT_KC_ID" ]; then
    echo "Client '$INVOICE_CLIENT_ID' already exists in realm '$REALM_NAME'. Skipping creation."
else
    $KCADM_CMD create clients -r $REALM_NAME \
      -s clientId=$INVOICE_CLIENT_ID \
      -s name="Invoice Service" \
      -s description="OIDC client for the Invoice microservice" \
      -s enabled=true \
      -s protocol=openid-connect \
      -s standardFlowEnabled=true \
      -s implicitFlowEnabled=false \
      -s directAccessGrantsEnabled=true \
      -s serviceAccountsEnabled=true \
      -s publicClient=false \
      -s "redirectUris=[\"$INVOICE_REDIRECT_URI\"]" \
      -s "webOrigins=[\"+\"]" # Add appropriate web origins if needed for CORS
    echo "Client '$INVOICE_CLIENT_ID' created."
    # Optional: Get the internal ID of the created client
    # INVOICE_CLIENT_INTERNAL_ID=$($KCADM_CMD get clients -r $REALM_NAME -q clientId=$INVOICE_CLIENT_ID --fields id --format csv --noquotes)
    # echo "Invoice client internal ID: $INVOICE_CLIENT_INTERNAL_ID"
fi

# --- 4. Create OIDC Client for Email Microservice ---
echo "Creating OIDC client for Email microservice ('$EMAIL_CLIENT_ID')..."
EMAIL_CLIENT_KC_ID=$($KCADM_CMD get clients -r $REALM_NAME --fields id,clientId | jq -r ".[] | select(.clientId==\"$EMAIL_CLIENT_ID\") | .id")

if [ -n "$EMAIL_CLIENT_KC_ID" ]; then
    echo "Client '$EMAIL_CLIENT_ID' already exists in realm '$REALM_NAME'. Skipping creation."
else
    $KCADM_CMD create clients -r $REALM_NAME \
      -s clientId=$EMAIL_CLIENT_ID \
      -s name="Email Service" \
      -s description="OIDC client for the Email microservice" \
      -s enabled=true \
      -s protocol=openid-connect \
      -s standardFlowEnabled=true \
      -s implicitFlowEnabled=false \
      -s directAccessGrantsEnabled=true \
      -s serviceAccountsEnabled=true \
      -s publicClient=false \
      -s "redirectUris=[\"$EMAIL_REDIRECT_URI\"]" \
      -s "webOrigins=[\"+\"]"
    echo "Client '$EMAIL_CLIENT_ID' created."
fi

# --- 5. Create OIDC Client for Sales Dashboard Microservice (UI Application) ---
echo "Creating OIDC client for Sales Dashboard microservice ('$SALES_CLIENT_ID')..."
SALES_CLIENT_KC_ID=$($KCADM_CMD get clients -r $REALM_NAME --fields id,clientId | jq -r ".[] | select(.clientId==\"$SALES_CLIENT_ID\") | .id")

if [ -n "$SALES_CLIENT_KC_ID" ]; then
    echo "Client '$SALES_CLIENT_ID' already exists in realm '$REALM_NAME'. Skipping creation."
else
    $KCADM_CMD create clients -r $REALM_NAME \
      -s clientId=$SALES_CLIENT_ID \
      -s name="Sales Dashboard Service" \
      -s description="OIDC client for the Sales Dashboard backend service" \
      -s enabled=true \
      -s protocol=openid-connect \
      -s standardFlowEnabled=true \
      -s implicitFlowEnabled=false \
      -s directAccessGrantsEnabled=false \
      -s serviceAccountsEnabled=true \
      -s publicClient=false \
      -s "redirectUris=[\"$SALES_REDIRECT_URI\"]" \
      -s "webOrigins=[\"+\"]" # Adjust webOrigins if this service doesn't need CORS from browsers
    echo "Client '$SALES_CLIENT_ID' created."
fi

# --- 6. Optional: Add Service Account Roles (Client Credentials Grant) ---
# If your services (e.g., invoice_service) need to call other services,
# you might want to assign roles to their service accounts.

# Example: Assign 'realm-management/query-users' role to invoice_service service account
# This is a powerful role, use with caution and grant only necessary permissions.
# SERVICE_ACCOUNT_USER_ID=$($KCADM_CMD get users -r $REALM_NAME -q username=service-account-$INVOICE_CLIENT_ID --fields id --format csv --noquotes)
# if [ -n "$SERVICE_ACCOUNT_USER_ID" ]; then
#   echo "Assigning realm-management.query-users to $INVOICE_CLIENT_ID service account..."
#   $KCADM_CMD add-roles -r $REALM_NAME --uusername service-account-$INVOICE_CLIENT_ID --rolename query-users --cclientid realm-management
#   echo "Role assigned."
# else
#   echo "Service account for $INVOICE_CLIENT_ID not found. This might happen if serviceAccountsEnabled was false or client was just created."
# fi


# --- 7. Logout (Optional) ---
# echo "Logging out from Keycloak Admin CLI..."
# $KCADM_CMD config credentials --server $KEYCLOAK_URL --realm master --user "" --password "" # Clear credentials

echo "--- Keycloak OIDC Configuration Script Finished ---"
echo "Please review the output above for any errors."
echo "Make sure to make this script executable: chmod +x configure_keycloak_oidc.sh"
echo "You will likely need to run this script INSIDE the Keycloak container or have kcadm.sh configured locally."
echo "Example to run inside Docker: docker cp ./configure_keycloak_oidc.sh <container_id>:/tmp/ && docker exec -it <container_id> /tmp/configure_keycloak_oidc.sh"
echo "You may also need to install 'jq' in the container if it's not present: apt-get update && apt-get install -y jq"
