// Define the API base URL (replace with actual environment variable or config)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080/api'; // Default for local dev

/**
 * Utility function for making API calls.
 *
 * @param {string} endpoint - The API endpoint (e.g., '/settings/onboarding/status').
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE).
 * @param {object} [body=null] - Request body for POST/PUT requests.
 * @param {object} [additionalHeaders={}] - Any additional headers.
 * @returns {Promise<any>} - The JSON response from the API.
 * @throws {Error} - Throws an error if the API call fails or returns a non-OK status.
 */
import { getKeycloakInstance } from '@/lib/keycloakService';

export const callApi = async (endpoint, method = 'GET', body = null, additionalHeaders = {}) => {
  let token = null;
  const kcInstance = getKeycloakInstance();

  if (kcInstance && kcInstance.token) {
    // Ensure token is fresh before making the call
    // This is a simplified check. A more robust way is to check token expiry or use kcInstance.updateToken()
    // However, updateToken is async and callApi is often expected to be directly awaitable.
    // The AuthContext's getToken() is better for this, but callApi is not a hook.
    // For now, we'll use the current token and rely on AuthContext's proactive refresh or onTokenExpired handler.

    // Proactively try to update token if it's close to expiring (e.g., within 30 seconds)
    // This adds slight complexity here but might be safer.
    try {
        if (kcInstance.isTokenExpired(30)) { // Check if token expires in next 30s
            await kcInstance.updateToken(30); // Attempt to refresh if expiring soon
        }
        token = kcInstance.token;
    } catch (error) {
        console.error("Failed to refresh token in callApi, proceeding with current token or none.", error);
        // If refresh fails, token might become null if it was already expired and couldn't be refreshed.
        // Or keycloak-js might clear it. For simplicity, we just use what's there after attempt.
        token = kcInstance.token;
        // Potentially, if refresh fails critically, one might want to trigger logout or throw a specific error.
        // For now, we let the API call proceed, and it might fail with a 401 if the token is bad.
    }
  }

  const headers = {
    ...additionalHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    if (body instanceof FormData) {
      // Don't set Content-Type for FormData, browser does it
    } else {
      headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, use status text
        errorData = { message: response.statusText };
      }
      throw new Error( (errorData && errorData.message) || `API request failed with status ${response.status}`);
    }

    // Handle cases where response might be empty (e.g., 204 No Content)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return null; // Or handle as appropriate for non-JSON responses

  } catch (error) {
    console.error('API call error:', error.message || error); // Log the error message
    throw error; // Re-throw the error to be caught by the caller
  }
};
