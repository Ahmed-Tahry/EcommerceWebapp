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
  console.log('API: callApi called with:');
  console.log('API: endpoint:', endpoint);
  console.log('API: method:', method);
  console.log('API: body:', body);
  console.log('API: additionalHeaders:', additionalHeaders);
  console.log('API: selectedShop:', selectedShop);
  
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
  console.log('API: selectedShop object:', selectedShop);
  console.log('API: selectedShopId from selectedShop:', selectedShopId);
  
  if (!selectedShopId) {
    selectedShopId = localStorage.getItem('selectedShopId');
    console.log('API: selectedShopId from localStorage:', selectedShopId);
  }
  
  if (selectedShopId) {
    headers['X-Shop-ID'] = selectedShopId;
    console.log('API: Added X-Shop-ID header:', selectedShopId);
  } else {
    console.log('API: No shopId available, X-Shop-ID header not added');
  }

  // Add user ID from token if available
  if (kcInstance && kcInstance.tokenParsed) {
    const userId = kcInstance.tokenParsed.sub || '';
    headers['X-User-ID'] = userId;
    console.log('API: Added X-User-ID header:', userId);
  } else {
    console.log('API: No user ID available from token');
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
  
  console.log('API: Final request configuration:');
  console.log('API: URL:', url);
  console.log('API: Method:', method);
  console.log('API: Headers:', headers);
  console.log('API: Body:', body);

  try {
    console.log('API: Making fetch request...');
    const response = await fetch(url, config);
    console.log('API: Response received:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API call failed: ${response.status} ${response.statusText}`, errorText);
      console.error('API: Failed request details:');
      console.error('API: URL:', url);
      console.error('API: Headers sent:', headers);
      console.error('API: Body sent:', body);
      throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API: Response data:', data);
    return data;
  } catch (error: any) {
    console.error('API call failed:', error);
    console.error('API: Error details:');
    console.error('API: URL:', url);
    console.error('API: Headers sent:', headers);
    console.error('API: Body sent:', body);
    throw error;
  }
};
