const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost/api'; // Default for local dev

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

export const callApi = async (endpoint, method = 'GET', body = null, additionalHeaders = {}, selectedShop = null) => {
  let token = null;
  const kcInstance = getKeycloakInstance();

  if (kcInstance && kcInstance.token) {

    try {
        if (kcInstance.isTokenExpired(30)) { 
            await kcInstance.updateToken(30); 
        }
        token = kcInstance.token;
    } catch (error) {
        console.error("Failed to refresh token in callApi, proceeding with current token or none.", error);

        token = kcInstance.token;

    }
  }

  const headers = {
    ...additionalHeaders,
  };

  if (token) {
    console.log("the token here" ,token)
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add shop ID from parameter or localStorage if available
  let selectedShopId = selectedShop ? selectedShop.shopId : null;
  if (!selectedShopId) {
    selectedShopId = localStorage.getItem('selectedShopId');
  }
  
  if (selectedShopId) {
    headers['X-Shop-ID'] = selectedShopId;
    console.log('callApi: Added X-Shop-ID header:', selectedShopId);
  } else {
    console.log('callApi: No shop ID available in localStorage or parameter');
    console.log('callApi: Available localStorage keys:', Object.keys(localStorage));
  }

  // Add user ID from localStorage or extract from token
  const userId = localStorage.getItem('userId');
  if (userId) {
    headers['X-User-ID'] = userId;
    console.log('callApi: Added X-User-ID header:', userId);
  } else {
    console.log('callApi: No user ID available in localStorage');
    console.log('callApi: Available localStorage keys:', Object.keys(localStorage));
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
