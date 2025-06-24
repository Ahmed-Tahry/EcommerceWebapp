import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import KeycloakService from '../keycloak'; // Adjust path as necessary

// Base URL for your Nginx proxy that routes to backend services
// This should point to where your Nginx is accessible from the frontend.
// All API calls will be prefixed with this. Nginx then routes based on path.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost'; // Nginx server URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add the Keycloak token to requests
apiClient.interceptors.request.use(
  async (config: any) => { // Use 'any' for config or find a more specific type if Axios default doesn't fit well with Keycloak updates
    if (KeycloakService.isLoggedIn()) {
      const token = KeycloakService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Optional: Handle token refresh if needed, though KeycloakService.updateToken can be called proactively
      // await KeycloakService.updateToken(() => {}); // Example: ensure token is fresh
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor for responses (optional, for global error handling or logging)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors globally if desired
    if (error.response?.status === 401) {
      console.error('API Request Unauthorized (401):', error.response.data);
      // Optionally, trigger a logout or token refresh if appropriate
      // KeycloakService.doLogout();
    } else if (error.response?.status === 403) {
      console.error('API Request Forbidden (403):', error.response.data);
    } else {
      console.error('API Request Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// --- Settings Service API Calls ---

// Account Details (per-user)
export const getAccountSettings = (): Promise<AxiosResponse<any>> => {
  return apiClient.get('/api/settings/account'); // Nginx routes this to settings_service
};

export const saveAccountSettings = (data: { bolClientId: string | null; bolClientSecret: string | null }): Promise<AxiosResponse<any>> => {
  return apiClient.post('/api/settings/account', data);
};

// Onboarding Status (per-user)
export const getOnboardingStatus = (): Promise<AxiosResponse<any>> => {
  return apiClient.get('/api/settings/onboarding/status');
};

export const updateOnboardingStep = (stepUpdate: { [key: string]: boolean }): Promise<AxiosResponse<any>> => {
  // Example: stepUpdate = { hasConfiguredBolApi: true }
  return apiClient.post('/api/settings/onboarding/step', stepUpdate);
};


// --- Shop Service API Calls (Example) ---
// Add methods here as needed to interact with shop_service via Nginx
// export const getShopOrders = (params?: any): Promise<AxiosResponse<any>> => {
//   return apiClient.get('/api/shop/orders', { params });
// };


export default apiClient; // Export the configured axios instance if direct use is preferred
// Or export individual functions like above.
