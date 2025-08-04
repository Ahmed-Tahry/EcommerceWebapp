import { getKeycloakInstance } from '@/lib/keycloakService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost/api'; // Default for local dev

/**
 * Utility function for making API calls.
 *
 * @param endpoint - The API endpoint (e.g., '/settings/onboarding/status').
 * @param method - HTTP method (GET, POST, PUT, DELETE).
 * @param body - Request body for POST/PUT requests.
 * @param additionalHeaders - Any additional headers.
 * @param selectedShop - Selected shop object with shopId.
 * @returns The JSON response from the API.
 * @throws Throws an error if the API call fails or returns a non-OK status.
 */
export const callApi = async (
  endpoint: string,
  method: string = 'GET',
  body?: any,
  additionalHeaders: Record<string, string> = {},
  selectedShop?: any
): Promise<any> => {
  let token: string | null = null;
  const kcInstance = getKeycloakInstance();

  if (kcInstance && kcInstance.token) {
    try {
      if (kcInstance.isTokenExpired(30)) {
        await kcInstance.updateToken(30);
      }
      token = kcInstance.token;
      console.log('Bearer token:', token);
    } catch (error) {
      console.error("Failed to refresh token in callApi, proceeding with current token or none.", error);
      token = kcInstance.token;
      console.log('Bearer token (after error):', token);
    }
  }

  const headers: Record<string, string> = {
    ...additionalHeaders,
  };

  if (token) {
    console.log('Adding Authorization header with Bearer token:', token);
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('No token available, not adding Authorization header');
  }

  // Add shop ID from parameter or localStorage if available
  let selectedShopId: string | null = selectedShop ? selectedShop.shopId : null;
  if (!selectedShopId) {
    selectedShopId = localStorage.getItem('selectedShopId');
  }
  
  if (selectedShopId) {
    headers['X-Shop-ID'] = selectedShopId;
  }

  // Add user ID from token if available
  if (kcInstance && kcInstance.tokenParsed) {
    headers['X-User-ID'] = kcInstance.tokenParsed.sub || '';
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, use status text
        errorData = { message: response.statusText };
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
    throw error; // Re-throw the error to be caught by the caller
  }
};
