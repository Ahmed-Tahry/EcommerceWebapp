

let keycloakInstance = null;

export const getKeycloakInstance = () => {
  if (!keycloakInstance) {

  }
  return keycloakInstance;
};

export const setKeycloakInstance = (kc) => {
  if (typeof window !== 'undefined') { 
    keycloakInstance = kc;
  }
};
