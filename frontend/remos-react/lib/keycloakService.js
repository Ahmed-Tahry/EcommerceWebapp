// This module will hold a reference to the initialized Keycloak instance.
// It's a way to allow non-React parts of the app (like utils/api.js)
// to access the Keycloak instance managed by AuthContext.bingo

let keycloakInstance = null;

export const getKeycloakInstance = () => {
  if (!keycloakInstance) {
    // console.warn('Keycloak instance has not been initialized yet or not running in client environment.');
    // This might be called server-side during Next.js build, so handle gracefully.
  }
  return keycloakInstance;
};

export const setKeycloakInstance = (kc) => {
  if (typeof window !== 'undefined') { // Ensure this is only set client-side
    keycloakInstance = kc;
  }
};
