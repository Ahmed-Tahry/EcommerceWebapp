'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import Keycloak from 'keycloak-js';
import keycloakConfig from '@/config/keycloakConfig';
import { setKeycloakInstance } from '@/lib/keycloakService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const keycloakRef = useRef(null);
  const isInitializedRef = useRef(false); // Explicit flag to track initialization

  useEffect(() => {
    if (typeof window === 'undefined') return; // Client-side only

    if (!keycloakRef.current) {
      // Create Keycloak instance only if it doesn't exist
      const kcInstance = new Keycloak(keycloakConfig);
      keycloakRef.current = kcInstance;
      setKeycloak(kcInstance);
      setKeycloakInstance(kcInstance);
    }

    const kc = keycloakRef.current;

    if (isInitializedRef.current) {
      // If already initialized, update state based on current Keycloak status
      setAuthenticated(kc.authenticated);
      setToken(kc.token);
      if (kc.authenticated) {
        kc.loadUserProfile()
          .then(profile => setUserProfile(profile))
          .catch(err => {
            console.error('Failed to load user profile', err);
            setUserProfile(null);
          });
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
      return;
    }

    // Initialize Keycloak only if not previously initialized
    kc.init({
      onLoad: 'check-sso',
    })
      .then(auth => {
        isInitializedRef.current = true; // Mark as initialized
        setAuthenticated(auth);
        setToken(kc.token);
        if (auth) {
          kc.loadUserProfile()
            .then(profile => setUserProfile(profile))
            .catch(err => {
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
        isInitializedRef.current = true; // Mark as initialized even on failure to prevent retries
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
    kc.onAuthRefreshError = () => {
      console.error('Token Refresh Error. Logging out.');
      setAuthenticated(false);
      setUserProfile(null);
      setToken(null);
      kc.logout();
    };
    kc.onTokenExpired = () => {
      console.log('Token Expired, attempting refresh');
      kc.updateToken(30).catch(() => {
        console.error('Failed to refresh expired token. Logging out.');
        kc.logout();
      });
    };

    // Token refresh interval
    const tokenRefreshInterval = setInterval(() => {
      if (kc.token && isInitializedRef.current) {
        kc.updateToken(60)
          .then(refreshed => {
            if (refreshed) {
              console.log('Token refreshed proactively');
              setToken(kc.token);
            }
          })
          .catch(() => {
            console.error('Proactive token refresh failed');
          });
      }
    }, 30000);

    return () => {
      clearInterval(tokenRefreshInterval);
      // Remove event listeners to prevent memory leaks
      kc.onAuthSuccess = null;
      kc.onAuthError = null;
      kc.onAuthRefreshSuccess = null;
      kc.onAuthRefreshError = null;
      kc.onTokenExpired = null;
    };
  }, []);

  const login = useCallback(() => {
    if (keycloak) {
      keycloak.login({ redirectUri: window.location.origin + '/' });
    }
  }, [keycloak]);

  const logout = useCallback(() => {
    if (keycloak) {
      keycloak.logout({ redirectUri: window.location.origin + '/' });
    }
  }, [keycloak]);

  const updateToken = useCallback(
    (minValidity = 5) => {
      if (keycloak) {
        return keycloak.updateToken(minValidity);
      }
      return Promise.reject('Keycloak not initialized');
    },
    [keycloak]
  );

  const value = {
    keycloak,
    authenticated,
    userProfile,
    token,
    isLoading,
    login,
    logout,
    updateToken,
    getToken: useCallback(async () => {
      if (!keycloak || !keycloak.token) return null;
      try {
        await updateToken(30);
        return keycloak.token;
      } catch (error) {
        console.error('Failed to refresh token before getting it:', error);
        logout();
        return null;
      }
    }, [keycloak, updateToken, logout]),
  };

  if (isLoading && typeof window !== 'undefined') {
    return <div>Authenticating...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};