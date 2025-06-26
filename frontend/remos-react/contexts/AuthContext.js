'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import Keycloak from 'keycloak-js';
import keycloakConfig from '@/config/keycloakConfig'; // Use @/ path alias

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // For initial auth check

  const keycloakRef = useRef(null); // To hold the Keycloak instance

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure running on client-side
      if (!keycloakRef.current) {
        // Initialize Keycloak instance only once
        const kcInstance = new Keycloak(keycloakConfig);
        keycloakRef.current = kcInstance;
        setKeycloak(kcInstance);
      }

import { setKeycloakInstance } from '@/lib/keycloakService'; // Import the setter

      const kc = keycloakRef.current;
      setKeycloakInstance(kc); // Set the instance in the service

      kc.init({
        onLoad: 'check-sso', // Checks if user is already logged in via SSO
        // silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html', // Optional for silent SSO checks
        // pkceMethod: 'S256' // Recommended for public clients, if configured in Keycloak
      })
      .then(auth => {
        setAuthenticated(auth);
        setToken(kc.token);
        if (auth) {
          kc.loadUserProfile().then(profile => {
            setUserProfile(profile);
          }).catch(err => {
            console.error('Failed to load user profile', err);
            setUserProfile(null);
          });
        } else {
          setUserProfile(null);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Keycloak init failed', err);
        setAuthenticated(false);
        setUserProfile(null);
        setToken(null);
        setIsLoading(false);
      });

      // Event Listeners
      kc.onAuthSuccess = () => {
        console.log('Auth Success');
        setAuthenticated(true);
        setToken(kc.token);
        kc.loadUserProfile().then(setUserProfile).catch(() => setUserProfile(null));
      };
      kc.onAuthError = (errorData) => {
        console.error('Auth Error:', errorData);
        setAuthenticated(false);
        setUserProfile(null);
        setToken(null);
      };
      kc.onAuthRefreshSuccess = () => {
        console.log('Token Refreshed');
        setToken(kc.token);
      };
      kc.onAuthRefreshError = ()_ => {
        console.error('Token Refresh Error. Logging out.');
        setAuthenticated(false);
        setUserProfile(null);
        setToken(null);
        kc.logout(); // Or clear tokens and force re-login
      };
      kc.onTokenExpired = () => {
        console.log('Token Expired, attempting refresh');
        kc.updateToken(30).catch(() => { // Attempt to refresh token if it's expiring in 30s or less
          console.error('Failed to refresh expired token. Logging out.');
          kc.logout();
        });
      };

      // Optional: Set up an interval to periodically update the token
      const tokenRefreshInterval = setInterval(() => {
        if (kc.token) {
          kc.updateToken(60) // Update if token expires in less than 60s
            .then(refreshed => {
              if (refreshed) {
                console.log('Token refreshed proactively');
                setToken(kc.token);
              }
            }).catch(() => {
              console.error('Proactive token refresh failed');
            });
        }
      }, 30000); // e.g., every 30 seconds

      return () => {
        clearInterval(tokenRefreshInterval);
        // Potentially remove event listeners if necessary, though Keycloak instances are usually page-scoped
      };

    }
  }, []); // Empty dependency array ensures this runs once on mount

  const login = useCallback(() => {
    if (keycloak) {
      // The redirectUri should match one of the valid redirect URIs configured in Keycloak for this client
      keycloak.login({ redirectUri: window.location.origin + '/onboarding' });
    }
  }, [keycloak]);

  const logout = useCallback(() => {
    if (keycloak) {
      // The redirectUri after logout, usually the home page or login page
      keycloak.logout({ redirectUri: window.location.origin + '/' });
    }
  }, [keycloak]);

  const updateToken = useCallback((minValidity = 5) => {
    if (keycloak) {
      return keycloak.updateToken(minValidity);
    }
    return Promise.reject('Keycloak not initialized');
  }, [keycloak]);

  const value = {
    keycloak, // The Keycloak instance itself
    authenticated,
    userProfile,
    token,
    isLoading, // To know when initial auth check is complete
    login,
    logout,
    updateToken,
    // A helper to get current valid token, useful for API calls
    getToken: useCallback(async () => {
      if (!keycloak || !keycloak.token) return null;
      try {
        await updateToken(30); // Ensure token is valid for at least 30s
        return keycloak.token;
      } catch (error) {
        console.error("Failed to refresh token before getting it:", error);
        // Could trigger logout here or re-throw
        logout();
        return null;
      }
    }, [keycloak, updateToken, logout]),
  };

  // Render children only after initial loading is complete to avoid flicker or premature access
  // Or provide a loading screen
  if (isLoading && typeof window !== 'undefined') {
     // Basic loading state, can be replaced with a proper spinner/component
    return <div>Authenticating...</div>;
  }


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
