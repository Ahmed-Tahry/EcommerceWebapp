#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration Variables ---
KEYCLOAK_URL="${KEYCLOAK_URL:-http://keycloak:8080}" # Use environment variable if set, otherwise default
ADMIN_USER="${KEYCLOAK_ADMIN_USER:-admin}" # Keycloak master admin
ADMIN_PASSWORD="${KEYCLOAK_ADMIN_PASSWORD:-admin}" # Keycloak master admin password - CHANGE IN PRODUCTION & USE ENV VARS
REALM_NAME="myapp-realm" # The realm we are configuring

# New Roles
ROLE_SUPER_ADMIN="admin"
ROLE_TIER1="tier-1"
ROLE_TIER2="tier-2"
ROLE_TIER3="tier-3"

# Old Roles to be deleted (if they exist from a previous setup)
OLD_ROLE_ADMIN_LEGACY="realm_admin" # Previous admin role name
OLD_ROLE_CUSTOMER_LEGACY="customer" # Previous customer role name

# New Users and Passwords - CONSIDER USING SECURE METHODS TO SET THESE (e.g., env vars, secrets)
USER_ADMIN_USERNAME="admin-user"
USER_ADMIN_PASSWORD="PasswordForAdminUser789!"
USER_TIER1_USERNAME="tier1-user"
USER_TIER1_PASSWORD="PasswordForTier1User789!"
USER_TIER2_USERNAME="tier2-user"
USER_TIER2_PASSWORD="PasswordForTier2User789!"
USER_TIER3_USERNAME="tier3-user"
USER_TIER3_PASSWORD="PasswordForTier3User789!"

# Client ID that needs these roles in its scope
# This client should be created by 'configure_keycloak_oidc.sh' for 'myapp-realm'
TARGET_CLIENT_ID="myapp-api"

# Path to Keycloak Admin CLI (kcadm.sh)
KCADM_CMD="/opt/keycloak/bin/kcadm.sh"
# If kcadm.sh is in PATH and keycloak is local, this might work:
# KCADM_CMD="kcadm.sh"

echo "--- Starting Keycloak Roles and Users Configuration for realm '$REALM_NAME' ---"
echo "Keycloak URL: $KEYCLOAK_URL"
echo "Realm Name: $REALM_NAME"
echo "Target Client ID for scope_mappings: $TARGET_CLIENT_ID"

# --- 1. Login to Keycloak Admin CLI ---
echo "Attempting to log in to Keycloak ($KEYCLOAK_URL) as admin user '$ADMIN_USER'..."
$KCADM_CMD config credentials --server $KEYCLOAK_URL --realm master --user $ADMIN_USER --password $ADMIN_PASSWORD
echo "Admin login successful."

# --- 2. Delete Old Realm Roles (if they exist) ---
echo "Checking and deleting old realm roles (if any)..."
OLD_ROLES_TO_DELETE=("$OLD_ROLE_ADMIN_LEGACY" "$OLD_ROLE_CUSTOMER_LEGACY")
for OLD_ROLE in "${OLD_ROLES_TO_DELETE[@]}"; do
  if $KCADM_CMD get roles/"$OLD_ROLE" -r "$REALM_NAME" > /dev/null 2>&1; then
    echo "Deleting old realm role '$OLD_ROLE' from realm '$REALM_NAME'..."
    $KCADM_CMD delete roles/"$OLD_ROLE" -r "$REALM_NAME"
    echo "Old realm role '$OLD_ROLE' deleted."
  else
    echo "Old realm role '$OLD_ROLE' does not exist in realm '$REALM_NAME'. Skipping deletion."
  fi
done

# --- 3. Create New Realm Roles ---
echo "Checking and creating new realm roles..."
declare -A NEW_ROLES_DESCRIPTIONS
NEW_ROLES_DESCRIPTIONS["$ROLE_SUPER_ADMIN"]="Super Administrator role with full access"
NEW_ROLES_DESCRIPTIONS["$ROLE_TIER1"]="Tier 1 access role for specific features"
NEW_ROLES_DESCRIPTIONS["$ROLE_TIER2"]="Tier 2 access role for advanced features"
NEW_ROLES_DESCRIPTIONS["$ROLE_TIER3"]="Tier 3 access role for premium features"

for ROLE_NAME in "${!NEW_ROLES_DESCRIPTIONS[@]}"; do
  DESCRIPTION=${NEW_ROLES_DESCRIPTIONS[$ROLE_NAME]}
  if $KCADM_CMD get roles/"$ROLE_NAME" -r "$REALM_NAME" > /dev/null 2>&1; then
    echo "Realm role '$ROLE_NAME' already exists in realm '$REALM_NAME'. Skipping creation."
  else
    echo "Creating realm role '$ROLE_NAME' in realm '$REALM_NAME'..."
    $KCADM_CMD create roles -r "$REALM_NAME" -s name="$ROLE_NAME" -s description="$DESCRIPTION"
    echo "Realm role '$ROLE_NAME' created."
  fi
done

# --- 4. Create New Test Users ---
echo "Checking and creating new test users..."
declare -A USERS_PASSWORDS
USERS_PASSWORDS["$USER_ADMIN_USERNAME"]="$USER_ADMIN_PASSWORD"
USERS_PASSWORDS["$USER_TIER1_USERNAME"]="$USER_TIER1_PASSWORD"
USERS_PASSWORDS["$USER_TIER2_USERNAME"]="$USER_TIER2_PASSWORD"
USERS_PASSWORDS["$USER_TIER3_USERNAME"]="$USER_TIER3_PASSWORD"

# Define user attributes (email, firstName, lastName)
declare -A USER_ATTRIBUTES
USER_ATTRIBUTES["$USER_ADMIN_USERNAME"]="admin@myapp.com,Admin,User"
USER_ATTRIBUTES["$USER_TIER1_USERNAME"]="tier1@myapp.com,Tier1,User"
USER_ATTRIBUTES["$USER_TIER2_USERNAME"]="tier2@myapp.com,Tier2,User"
USER_ATTRIBUTES["$USER_TIER3_USERNAME"]="tier3@myapp.com,Tier3,User"

for USERNAME in "${!USERS_PASSWORDS[@]}"; do
  PASSWORD=${USERS_PASSWORDS[$USERNAME]}
  # Split attributes into email, firstName, lastName
  IFS=',' read -r EMAIL FIRSTNAME LASTNAME <<< "${USER_ATTRIBUTES[$USERNAME]}"
  # Check if user already exists by username
  if $KCADM_CMD get users -r "$REALM_NAME" -q username="$USERNAME" | jq -e ".[] | select(.username==\"$USERNAME\")" > /dev/null; then
    echo "User '$USERNAME' already exists in realm '$REALM_NAME'. Skipping creation."
  else
    echo "Creating user '$USERNAME' in realm '$REALM_NAME'..."
    $KCADM_CMD create users -r "$REALM_NAME" \
      -s username="$USERNAME" \
      -s enabled=true \
      -s emailVerified=true \
      -s email="$EMAIL" \
      -s firstName="$FIRSTNAME" \
      -s lastName="$LASTNAME" \
      -s "credentials=[{\"type\":\"password\",\"value\":\"$PASSWORD\",\"temporary\":false}]"
    echo "User '$USERNAME' created with email='$EMAIL', firstName='$FIRSTNAME', lastName='$LASTNAME'."
  fi
done

# --- 5. Assign New Realm Roles to New Users ---
echo "Assigning new realm roles to new users..."
declare -A USER_ROLE_ASSIGNMENTS
USER_ROLE_ASSIGNMENTS["$USER_ADMIN_USERNAME"]="$ROLE_SUPER_ADMIN"
USER_ROLE_ASSIGNMENTS["$USER_TIER1_USERNAME"]="$ROLE_TIER1"
USER_ROLE_ASSIGNMENTS["$USER_TIER2_USERNAME"]="$ROLE_TIER2"
USER_ROLE_ASSIGNMENTS["$USER_TIER3_USERNAME"]="$ROLE_TIER3"

for USERNAME in "${!USER_ROLE_ASSIGNMENTS[@]}"; do
  ROLE_TO_ASSIGN=${USER_ROLE_ASSIGNMENTS[$USERNAME]}
  echo "Attempting to assign role '$ROLE_TO_ASSIGN' to user '$USERNAME'..."
  # kcadm add-roles is generally idempotent (doesn't error if role is already assigned)
  $KCADM_CMD add-roles -r "$REALM_NAME" --uusername "$USERNAME" --rolename "$ROLE_TO_ASSIGN"
  echo "Role '$ROLE_TO_ASSIGN' assignment processed for user '$USERNAME'."
done

# --- 6. Configure Client Role Scope Mappings for the Target Client ---
echo "Configuring client role scope mappings for client '$TARGET_CLIENT_ID' in realm '$REALM_NAME'..."

ROLES_TO_MAP_TO_CLIENT=("$ROLE_SUPER_ADMIN" "$ROLE_TIER1" "$ROLE_TIER2" "$ROLE_TIER3")

echo "Fetching internal ID for client '$TARGET_CLIENT_ID'..."
CLIENT_INFO=$($KCADM_CMD get clients -r "$REALM_NAME" -q clientId="$TARGET_CLIENT_ID" --fields id,clientId --format json)
CLIENT_INTERNAL_ID=$(echo "$CLIENT_INFO" | jq -r ".[] | select(.clientId==\"$TARGET_CLIENT_ID\") | .id")

if [ -z "$CLIENT_INTERNAL_ID" ]; then
  echo "ERROR: Client '$TARGET_CLIENT_ID' not found in realm '$REALM_NAME'. Cannot configure role scope mappings."
  echo "Please ensure client '$TARGET_CLIENT_ID' is created (e.g., by 'configure_keycloak_oidc.sh') before running this script."
  exit 1
else
  echo "Client '$TARGET_CLIENT_ID' internal ID: $CLIENT_INTERNAL_ID."
  echo "Updating scope mappings for client '$TARGET_CLIENT_ID'..."

  # Add new roles to the client's scope mappings
  for ROLE_NAME in "${ROLES_TO_MAP_TO_CLIENT[@]}"; do
    # Fetch the role ID by directly querying the specific role
    REALM_ROLE_ID=$($KCADM_CMD get roles/"$ROLE_NAME" -r "$REALM_NAME" --fields id --format csv --noquotes 2>/dev/null || echo "")
    if [ -z "$REALM_ROLE_ID" ]; then
      echo "WARNING: Realm role '$ROLE_NAME' not found in realm '$REALM_NAME'. Cannot map to client '$TARGET_CLIENT_ID'."
      continue
    fi

    echo "Checking if realm role '$ROLE_NAME' is already mapped to client '$TARGET_CLIENT_ID' scope..."
    if $KCADM_CMD get clients/"$CLIENT_INTERNAL_ID"/scope-mappings/realm -r "$REALM_NAME" | jq -e --arg ROLE_NAME "$ROLE_NAME" '.[] | select(.name==$ROLE_NAME)' > /dev/null; then
      echo "Realm role '$ROLE_NAME' is already mapped to client '$TARGET_CLIENT_ID' scope. Skipping."
    else
      echo "Adding realm role '$ROLE_NAME' (ID: $REALM_ROLE_ID) to scope of client '$TARGET_CLIENT_ID'..."
      JSON_BODY_SINGLE_ROLE_MAP="[{\"id\": \"$REALM_ROLE_ID\", \"name\": \"$ROLE_NAME\"}]"
      $KCADM_CMD create clients/"$CLIENT_INTERNAL_ID"/scope-mappings/realm -r "$REALM_NAME" -b "$JSON_BODY_SINGLE_ROLE_MAP"
      echo "Realm role '$ROLE_NAME' added to scope for client '$TARGET_CLIENT_ID'."
    fi
  done
  echo "Client scope mapping configuration finished for '$TARGET_CLIENT_ID'."
fi

# --- 7. Configure Protocol Mappers for Client to Include User Attributes ---
echo "Configuring protocol mappers for client '$TARGET_CLIENT_ID' to include email, firstName, and lastName..."

# Define mappers for email, firstName, and lastName
declare -A PROTOCOL_MAPPERS
PROTOCOL_MAPPERS["email"]="email"
PROTOCOL_MAPPERS["givenName"]="firstName"
PROTOCOL_MAPPERS["familyName"]="lastName"

for ATTR_NAME in "${!PROTOCOL_MAPPERS[@]}"; do
  CLAIM_NAME=${PROTOCOL_MAPPERS[$ATTR_NAME]}
  echo "Checking if protocol mapper for '$CLAIM_NAME' exists for client '$TARGET_CLIENT_ID'..."
  MAPPER_EXISTS=$($KCADM_CMD get clients/"$CLIENT_INTERNAL_ID"/protocol-mappers/models -r "$REALM_NAME" | jq -e --arg CLAIM_NAME "$CLAIM_NAME" '.[] | select(.name==$CLAIM_NAME)' > /dev/null && echo "true" || echo "false")
  
  if [ "$MAPPER_EXISTS" = "true" ]; then
    echo "Protocol mapper for '$CLAIM_NAME' already exists for client '$TARGET_CLIENT_ID'. Skipping creation."
  else
    echo "Creating protocol mapper for '$CLAIM_NAME' for client '$TARGET_CLIENT_ID'..."
    $KCADM_CMD create clients/"$CLIENT_INTERNAL_ID"/protocol-mappers/models -r "$REALM_NAME" -b '{
      "name": "'"$CLAIM_NAME"'",
      "protocol": "openid-connect",
      "protocolMapper": "oidc-usermodel-property-mapper",
      "consentRequired": false,
      "config": {
        "user.attribute": "'"$ATTR_NAME"'",
        "claim.name": "'"$CLAIM_NAME"'",
        "jsonType.label": "String",
        "id.token.claim": "true",
        "access.token.claim": "true",
        "userinfo.token.claim": "true"
      }
    }'
    echo "Protocol mapper for '$CLAIM_NAME' created for client '$TARGET_CLIENT_ID'."
  fi
done

# --- 8. Logout from Keycloak Admin CLI (Optional) ---
# echo "Logging out from Keycloak Admin CLI..."
# $KCADM_CMD config credentials --server $KEYCLOAK_URL --realm master # This command might vary depending on kcadm version, often clears context
# echo "Admin logout successful."

echo "--- Keycloak Roles and Users Configuration Script for realm '$REALM_NAME' Finished ---"
echo "Review the output above for any errors or warnings."
echo "Ensure this script is executable: chmod +x $(basename "$0")"
echo "This script should typically be run after the realm and client '$TARGET_CLIENT_ID' have been created."
echo "IMPORTANT: Review and change default passwords for users if this is for a production environment!"
echo "Consider managing passwords and sensitive data through environment variables or a secrets manager."