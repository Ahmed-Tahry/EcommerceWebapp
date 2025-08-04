import Keycloak from 'keycloak-js';

let keycloakInstance: Keycloak | null = null;

export const getKeycloakInstance = (): Keycloak | null => {
  return keycloakInstance;
};

export const setKeycloakInstance = (kc: Keycloak): void => {
  keycloakInstance = kc;
};
