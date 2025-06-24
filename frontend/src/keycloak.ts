import Keycloak from 'keycloak-js';

// Initialize Keycloak instance
// The configuration would typically come from environment variables or a config file.
// Ensure your Keycloak realm 'myapp-realm' and client 'myapp-frontend-client' (or similar) are set up correctly.
// The client 'myapp-frontend-client' should be a public client in Keycloak.
const keycloakConfig: Keycloak.KeycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL || 'http://keycloak-server:8080', // Your Keycloak server URL
  realm: process.env.REACT_APP_KEYCLOAK_REALM || 'myapp-realm', // Your realm name
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'myapp-frontend-client', // Your client ID for the React app
};

const keycloak = new Keycloak(keycloakConfig);

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback: () => void): void => {
  keycloak
    .init({
      onLoad: 'login-required', // Automatically redirects to login if not authenticated
      // silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html', // Optional for silent SSO checks
      pkceMethod: 'S256', // Recommended for public clients
      checkLoginIframe: false, // Can be problematic with some browsers/setups
    })
    .then((authenticated) => {
      if (authenticated) {
        console.log('Keycloak: User is authenticated');
        onAuthenticatedCallback();
      } else {
        console.warn('Keycloak: User is not authenticated');
        // keycloak.login(); // Or handle not authenticated state
      }
    })
    .catch((error) => {
      console.error('Keycloak: Initialization Failed', error);
    });
};

const doLogin = keycloak.login;

const doLogout = keycloak.logout;

const getToken = (): string | undefined => keycloak.token;

const isLoggedIn = (): boolean => !!keycloak.token;

const updateToken = (successCallback: () => void): Promise<boolean | void> =>
  keycloak.updateToken(5).then(successCallback).catch(doLogin);

const getUsername = (): string | undefined => keycloak.tokenParsed?.preferred_username;

const getUserId = (): string | undefined => keycloak.tokenParsed?.sub; // Keycloak subject ID

const hasRole = (roles: string[]): boolean => roles.some((role) => keycloak.hasRealmRole(role));

const KeycloakService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  getUserId,
  hasRole,
};

export default KeycloakService;
