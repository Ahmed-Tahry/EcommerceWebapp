const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8180', // Keycloak server URL
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'myapp-realm', // Realm name
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'myapp-api', // Client ID for the frontend
};

export default keycloakConfig;
