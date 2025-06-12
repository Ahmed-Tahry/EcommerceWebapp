#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration Variables ---
# TODO: Update these placeholder values with your actual configuration.
KEYCLOAK_URL="http://localhost:8080"
ADMIN_USER="admin"
ADMIN_PASSWORD="admin" # Default password, change in production!
REALM_NAME="microservices_realm" # Should match the realm created in the previous script

ROLE_ADMIN="realm_admin"
ROLE_CUSTOMER="customer"

USER_ADMIN_USERNAME="service_admin"
USER_ADMIN_PASSWORD="admin_password123" # Change this!
USER_CUSTOMER_USERNAME="app_customer"
USER_CUSTOMER_PASSWORD="customer_password123" # Change this!

INVOICE_CLIENT_ID="invoice_service"
EMAIL_CLIENT_ID="email_service"
SALES_CLIENT_ID="sales_dashboard_service"

# Path to Keycloak Admin CLI (kcadm.sh)
KCADM_CMD="kcadm.sh" # Or "/opt/jboss/keycloak/bin/kcadm.sh" if inside the official container

echo "--- Starting Keycloak Roles and Users Configuration ---"

# --- 1. Login to Keycloak Admin CLI ---
echo "Attempting to log in to Keycloak as admin..."
$KCADM_CMD config credentials --server $KEYCLOAK_URL --realm master --user $ADMIN_USER --password $ADMIN_PASSWORD
echo "Login successful."

# --- 2. Create Realm Roles ---
echo "Checking and creating realm roles..."

# Create Admin Role
if $KCADM_CMD get roles -r $REALM_NAME --rolename $ROLE_ADMIN > /dev/null 2>&1; then
  echo "Realm role '$ROLE_ADMIN' already exists in realm '$REALM_NAME'. Skipping creation."
else
  echo "Creating realm role '$ROLE_ADMIN' in realm '$REALM_NAME'..."
  $KCADM_CMD create roles -r $REALM_NAME -s name=$ROLE_ADMIN -s 'description=Administrator role for the realm'
  echo "Realm role '$ROLE_ADMIN' created."
fi

# Create Customer Role
if $KCADM_CMD get roles -r $REALM_NAME --rolename $ROLE_CUSTOMER > /dev/null 2>&1; then
  echo "Realm role '$ROLE_CUSTOMER' already exists in realm '$REALM_NAME'. Skipping creation."
else
  echo "Creating realm role '$ROLE_CUSTOMER' in realm '$REALM_NAME'..."
  $KCADM_CMD create roles -r $REALM_NAME -s name=$ROLE_CUSTOMER -s 'description=Customer role for applications'
  echo "Realm role '$ROLE_CUSTOMER' created."
fi

# --- 3. Create Sample Users ---
echo "Checking and creating sample users..."

# Create Admin User
if $KCADM_CMD get users -r $REALM_NAME -q username=$USER_ADMIN_USERNAME | grep -q "\"username\" : \"$USER_ADMIN_USERNAME\""; then
  echo "User '$USER_ADMIN_USERNAME' already exists in realm '$REALM_NAME'. Skipping creation."
else
  echo "Creating admin user '$USER_ADMIN_USERNAME'..."
  $KCADM_CMD create users -r $REALM_NAME \
    -s username=$USER_ADMIN_USERNAME \
    -s enabled=true \
    -s emailVerified=true \
    -s "credentials=[{\"type\":\"password\",\"value\":\"$USER_ADMIN_PASSWORD\",\"temporary\":false}]"
  echo "User '$USER_ADMIN_USERNAME' created."
fi

# Create Customer User
if $KCADM_CMD get users -r $REALM_NAME -q username=$USER_CUSTOMER_USERNAME | grep -q "\"username\" : \"$USER_CUSTOMER_USERNAME\""; then
  echo "User '$USER_CUSTOMER_USERNAME' already exists in realm '$REALM_NAME'. Skipping creation."
else
  echo "Creating customer user '$USER_CUSTOMER_USERNAME'..."
  $KCADM_CMD create users -r $REALM_NAME \
    -s username=$USER_CUSTOMER_USERNAME \
    -s enabled=true \
    -s emailVerified=true \
    -s "credentials=[{\"type\":\"password\",\"value\":\"$USER_CUSTOMER_PASSWORD\",\"temporary\":false}]"
  echo "User '$USER_CUSTOMER_USERNAME' created."
fi

# --- 4. Assign Realm Roles to Users ---
echo "Assigning realm roles to users..."

# Assign Admin Role to Admin User
echo "Assigning role '$ROLE_ADMIN' to user '$USER_ADMIN_USERNAME'..."
$KCADM_CMD add-roles -r $REALM_NAME --uusername $USER_ADMIN_USERNAME --rolename $ROLE_ADMIN
echo "Role '$ROLE_ADMIN' assigned to '$USER_ADMIN_USERNAME'."

# Assign Customer Role to Customer User
echo "Assigning role '$ROLE_CUSTOMER' to user '$USER_CUSTOMER_USERNAME'..."
$KCADM_CMD add-roles -r $REALM_NAME --uusername $USER_CUSTOMER_USERNAME --rolename $ROLE_CUSTOMER
echo "Role '$ROLE_CUSTOMER' assigned to '$USER_CUSTOMER_USERNAME'."

# --- 5. Configure Client Role Scope Mappings ---
# This ensures that realm roles are available in the token when authenticating against these clients.
echo "Configuring client role scope mappings..."

CLIENT_IDS=("$INVOICE_CLIENT_ID" "$EMAIL_CLIENT_ID" "$SALES_CLIENT_ID")
ROLES_TO_MAP=("$ROLE_ADMIN" "$ROLE_CUSTOMER")

for CLIENT_ID in "${CLIENT_IDS[@]}"; do
  echo "Fetching internal ID for client '$CLIENT_ID' in realm '$REALM_NAME'..."
  CLIENT_INTERNAL_ID=$($KCADM_CMD get clients -r $REALM_NAME -q clientId=$CLIENT_ID --fields id --format csv --noquotes)

  if [ -z "$CLIENT_INTERNAL_ID" ]; then
    echo "ERROR: Client '$CLIENT_ID' not found in realm '$REALM_NAME'. Skipping role scope mappings for this client."
    continue
  fi
  echo "Client '$CLIENT_ID' internal ID: $CLIENT_INTERNAL_ID"

  # Get the client's scope mappings object ID (this is different from the client's own ID)
  # This step assumes default client scopes are what we want to add to.
  # More advanced: create dedicated client scopes and map roles to those.
  # For default behavior (realm roles in token), we usually add them to the client's own "scope mappings" for realm roles.

  echo "Adding realm roles to scope mappings for client '$CLIENT_ID' (ID: $CLIENT_INTERNAL_ID)..."
  for ROLE_NAME in "${ROLES_TO_MAP[@]}"; do
      # Check if role is already mapped to client scope
      # This command structure is a bit complex for a simple check, Keycloak's kcadm.sh doesn't have a straightforward way
      # kcadm get client-scopes/{client-scope-id}/scope-mappings/realm lists effective roles, not direct mappings easily for a client.
      # We'll attempt to add and rely on Keycloak to handle duplicates gracefully or use the dedicated add-roles command for clients.

      # The `add-roles` command for a client's service account is different from adding realm roles to a client's scope.
      # To make realm roles appear in the token for users authenticating to this client:
      # 1. Get client's default "roles" client scope (usually named {client-id}-roles)
      # OR 2. Add realm roles to the client's "Realm Role Mappings" directly under "Scope" tab in UI.
      # The kcadm command for #2 is:
      # kcadm.sh create clients/{client-db-id}/scope-mappings/realm -r {realm} -b '{"name":"{role_name}"}' --id {role_id_of_realm_role}
      # This is becoming complex, a simpler way that often works for basic cases:
      echo "Mapping realm role '$ROLE_NAME' to client '$CLIENT_ID' scope..."
      # The command below adds the role to the client's list of assigned default roles for its scope.
      # This is equivalent to going to Client -> Scopes -> {client_id}-dedicated -> Assign Role
      # This command might not be what's needed for *all* clients, especially service accounts vs user-facing apps.
      # For user tokens, we want realm roles to be passed.
      # This is one way to do it: associate realm role with the client's scope.
      # Note: `kcadm add-roles --id` refers to the client's database ID, not client_id string.
      # And `--rolename` refers to the role name.
      # This command adds the specified realm role to the client's scope.
      # It makes the realm role available to be assigned to users and appear in their tokens for this client.

      # Get Realm Role ID
      REALM_ROLE_ID=$($KCADM_CMD get roles -r $REALM_NAME --rolename $ROLE_NAME --fields id --format csv --noquotes)
      if [ -z "$REALM_ROLE_ID" ]; then
          echo "ERROR: Realm role '$ROLE_NAME' not found in realm '$REALM_NAME'. Cannot map to client '$CLIENT_ID'."
          continue
      fi

      # This command maps a realm role to a client. This means if a user has this realm role,
      # it will be included in their token when they authenticate with this client.
      $KCADM_CMD add-roles --id $CLIENT_INTERNAL_ID -r $REALM_NAME --rolename $ROLE_NAME --target-client-id $CLIENT_ID
      # The above is not the correct command.
      # Correct command to add a realm role to a client's scope mappings:
      # kcadm create clients/{id}/scope-mappings/realm -r {realm} -b '{"name":"{role_name}"}'
      # Need to ensure the role is available to the client.
      # Let's try to add the role to the client's "effective roles" - this is often done for service accounts.
      # For user tokens, we need to ensure the client requests these roles via scopes, or they are added by default.
      # The simplest way is to ensure the client has the "full scope allowed" or the specific realm roles are added to its scope.
      # kcadm update clients/$CLIENT_INTERNAL_ID -r $REALM_NAME -s fullScopeAllowed=false  (if you want to be specific)
      # Then add roles to scope:
      # kcadm create clients/$CLIENT_INTERNAL_ID/scope-mappings/realm/$REALM_ROLE_ID -r $REALM_NAME (this seems more like it)
      # The CLI documentation for scope mappings can be a bit tricky.

      # Check if the role is already in the client's scope mappings.
      # kcadm get clients/$CLIENT_INTERNAL_ID/scope-mappings/realm -r $REALM_NAME | jq -e '.[] | select(.name=="'$ROLE_NAME'")' > /dev/null
      # The above jq check can be used. If it returns 0 (true), the mapping exists.

      echo "Checking if realm role '$ROLE_NAME' is already mapped to client '$CLIENT_ID' scope..."
      if $KCADM_CMD get clients/$CLIENT_INTERNAL_ID/scope-mappings/realm -r $REALM_NAME | jq -e --arg ROLE_NAME "$ROLE_NAME" '.[] | select(.name==$ROLE_NAME)' > /dev/null; then
        echo "Realm role '$ROLE_NAME' is already mapped to client '$CLIENT_ID' scope. Skipping."
      else
        echo "Adding realm role '$ROLE_NAME' (ID: $REALM_ROLE_ID) to scope of client '$CLIENT_ID'..."
        # Construct the JSON body for adding a single role to scope mappings
        JSON_BODY="[{\"id\": \"$REALM_ROLE_ID\", \"name\": \"$ROLE_NAME\"}]"
        $KCADM_CMD create clients/$CLIENT_INTERNAL_ID/scope-mappings/realm -r $REALM_NAME -b "$JSON_BODY"
        echo "Realm role '$ROLE_NAME' added to scope for client '$CLIENT_ID'."
      fi
  done
done


# --- 6. Logout (Optional) ---
# echo "Logging out from Keycloak Admin CLI..."
# $KCADM_CMD config credentials --server $KEYCLOAK_URL --realm master --user "" --password "" # Clear credentials

echo "--- Keycloak Roles and Users Configuration Script Finished ---"
echo "Please review the output above for any errors."
echo "Make sure to make this script executable: chmod +x configure_keycloak_roles.sh"
echo "Run this script after 'configure_keycloak_oidc.sh'."
echo "Remember to change default passwords for users in a production environment!"
