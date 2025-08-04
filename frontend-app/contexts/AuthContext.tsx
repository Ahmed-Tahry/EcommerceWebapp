'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import Keycloak from 'keycloak-js';
import keycloakConfig from '@/config/keycloakConfig';
import { setKeycloakInstance } from '@/lib/keycloakService';

interface AuthContextType {
  keycloak: Keycloak | null;
  authenticated: boolean;
  userProfile: Keycloak.KeycloakProfile | null;
  token: string | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  updateToken: (minValidity?: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<Keycloak.KeycloakProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const keycloakRef = useRef<Keycloak | null>(null);
  const isInitializedRef = useRef<boolean>(false); // Explicit flag to track initialization

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
      setAuthenticated(kc.authenticated || false);
      setToken(kc.token || null);
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
        setToken(kc.token || null);
        if (auth) {
          // Extract and store user ID from token
          if (kc.token) {
            try {
              const tokenPayload = JSON.parse(atob(kc.token.split('.')[1]));
              console.log('AuthContext: Token payload:', tokenPayload);
              const userId = tokenPayload.sub || tokenPayload.user_id || tokenPayload.preferred_username;
              if (userId) {
                localStorage.setItem('userId', userId);
                console.log('AuthContext: Stored userId in localStorage:', userId);
              } else {
                console.error('AuthContext: No userId found in token payload');
              }
            } catch (error) {
              console.error('AuthContext: Failed to extract userId from token:', error);
            }
          }
          
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
      setToken(kc.token || null);
      
      // Extract and store user ID from token
      if (kc.token) {
        try {
          const tokenPayload = JSON.parse(atob(kc.token.split('.')[1]));
          console.log('AuthContext: Token payload:', tokenPayload);
          const userId = tokenPayload.sub || tokenPayload.user_id || tokenPayload.preferred_username;
          if (userId) {
            localStorage.setItem('userId', userId);
            console.log('AuthContext: Stored userId in localStorage:', userId);
          }
        } catch (error) {
          console.error('AuthContext: Failed to extract userId from token:', error);
        }
      }
      
      kc.loadUserProfile().then(setUserProfile).catch(() => setUserProfile(null));
    };
    kc.onAuthError = (errorData) => {
      console.error('Auth Error:', errorData);
      setAuthenticated(false);
      setUserProfile(null);
      setToken(null);
      localStorage.removeItem('userId');
      console.log('AuthContext: Cleared userId from localStorage on auth error');
    };
    kc.onAuthRefreshSuccess = () => {
      console.log('Token Refreshed');
      setToken(kc.token || null);
    };
    kc.onAuthRefreshError = () => {
      console.error('Token Refresh Error. Logging out.');
      setAuthenticated(false);
      setUserProfile(null);
      setToken(null);
      localStorage.removeItem('userId');
      console.log('AuthContext: Cleared userId from localStorage on refresh error');
      if (kc.authenticated) {
        kc.logout();
      }
    };
    kc.onTokenExpired = () => {
      console.log('Token Expired, attempting refresh');
      kc.updateToken(30).catch(() => {
        console.error('Failed to refresh expired token. Logging out.');
        if (kc.authenticated) {
          kc.logout();
        }
      });
    };

    // Token refresh interval
    const tokenRefreshInterval = setInterval(() => {
      if (kc.token && isInitializedRef.current) {
        kc.updateToken(60)
          .then(refreshed => {
            if (refreshed) {
              console.log('Token refreshed proactively');
              setToken(kc.token || null);
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
      kc.onAuthSuccess = undefined;
      kc.onAuthError = undefined;
      kc.onAuthRefreshSuccess = undefined;
      kc.onAuthRefreshError = undefined;
      kc.onTokenExpired = undefined;
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
