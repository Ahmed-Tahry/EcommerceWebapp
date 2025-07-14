import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// HTTP client configuration
const createHttpClient = (baseURL: string, timeout: number = 30000): AxiosInstance => {
  return axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Retry configuration
interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
};

// Enhanced HTTP client with retry logic
export class HttpClient {
  private client: AxiosInstance;
  private retryConfig: RetryConfig;

  constructor(baseURL: string, timeout?: number, retryConfig?: Partial<RetryConfig>) {
    this.client = createHttpClient(baseURL, timeout);
    this.retryConfig = { ...defaultRetryConfig, ...retryConfig };
  }

  // Set authorization header
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Set user context headers
  setUserContext(userId: string, userRoles?: string): void {
    this.client.defaults.headers.common['X-User-ID'] = userId;
    if (userRoles) {
      this.client.defaults.headers.common['X-User-Roles'] = userRoles;
    }
  }

  // Retry logic
  private async retryRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    retryCount: number = 0
  ): Promise<AxiosResponse<T>> {
    try {
      return await requestFn();
    } catch (error: any) {
      if (retryCount >= this.retryConfig.maxRetries) {
        throw error;
      }

      // Only retry on network errors or 5xx server errors
      if (error.code === 'ECONNREFUSED' || 
          error.code === 'ENOTFOUND' || 
          error.code === 'ETIMEDOUT' ||
          (error.response && error.response.status >= 500)) {
        
        const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, retryCount);
        console.log(`Retrying request in ${delay}ms (attempt ${retryCount + 1}/${this.retryConfig.maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(requestFn, retryCount + 1);
      }
      
      throw error;
    }
  }

  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.client.get<T>(url, config));
  }

  // POST request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.client.post<T>(url, data, config));
  }

  // PUT request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.client.put<T>(url, data, config));
  }

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.client.delete<T>(url, config));
  }

  // PATCH request
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.retryRequest(() => this.client.patch<T>(url, data, config));
  }
}

// Service-specific HTTP clients
export const createSettingsServiceClient = (): HttpClient => {
  const baseURL = process.env.SETTINGS_SERVICE_URL || 'http://settings_service:3000';
  return new HttpClient(baseURL, 10000, { maxRetries: 2 });
};

export const createShopServiceClient = (): HttpClient => {
  const baseURL = process.env.SHOP_SERVICE_URL || 'http://shop_service:3000';
  return new HttpClient(baseURL, 15000, { maxRetries: 3 });
};

// Error handling utilities
export class ServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public service: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export const handleServiceError = (error: any, serviceName: string): never => {
  if (error.response) {
    // Server responded with error status
    throw new ServiceError(
      `Service ${serviceName} error: ${error.response.data?.message || error.message}`,
      error.response.status,
      serviceName,
      error
    );
  } else if (error.request) {
    // Request was made but no response received
    throw new ServiceError(
      `Service ${serviceName} unavailable: No response received`,
      503,
      serviceName,
      error
    );
  } else {
    // Something else happened
    throw new ServiceError(
      `Service ${serviceName} error: ${error.message}`,
      500,
      serviceName,
      error
    );
  }
}; 