
// Manually define types if direct import fails, or ensure @types/axios is compatible
// This usually means there's an issue with how types are resolved or module settings.
// For now, let's assume the named imports should work and the issue might be elsewhere or version conflict.
// If these still fail, the types might be accessible via axios.default.AxiosInstance etc. or need manual definition.
import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Define the structure for the process status response
// Exporting it so it can be imported by other services if needed (e.g. shop.service.ts)
export interface ProcessStatusLink {
  rel: string;
  href: string;
  method: string;
}
export interface ProcessStatus {
  processStatusId: string;
  entityId: string;
  eventType: string;
  description: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILURE' | 'TIMEOUT';
  errorMessage?: string;
  createTimestamp: string;
  links: Array<{
    rel: string;
    href: string;
    method: string;
  }>;
}

// Define the structure for the offer export request
interface OfferExportRequest {
  format: 'CSV' | 'XML'; // Add other formats if needed
}

// Define the structure for Bol API Order (simplified for fetching)
// This should be expanded based on the actual API response structure from Bol.
// For now, this is a placeholder.
export interface BolOrder {
  orderId: string;
  orderPlacedDateTime: string;
  orderItems: BolOrderItem[];
  // Add other relevant fields from Bol API order list response
  fulfilmentMethod?: string; // Example: 'FBR' or 'FBB'
  // Potentially customer details, shipment details etc. that we might ignore for now
}

export interface BolOrderItem {
  orderItemId: string;
  product: {
    ean: string;
    title?: string; // Optional, as we decided not to map it for now
  };
  offer?: { // Offer details might be nested
    offerId?: string; // Optional
    reference?: string; // Optional
  };
  quantity: number;
  quantityShipped?: number;
  quantityCancelled?: number;
  unitPrice?: number; // Optional, as we decided not to map it for now
  commission?: number; // Optional, as we decided not to map it for now
  fulfilment?: { // Fulfilment details might be nested
    method?: string; // e.g. FBR, FBB
    status?: string; // e.g. OPEN, SHIPPED
    latestChangedDateTime?: string;
  };
  cancellationRequest?: boolean;
  // Add other relevant fields from Bol API
}

// --- Interfaces for Product Content ---
// Based on GET /retailer/content/products/{ean} response
export interface BolProductAttributeValue {
  value: string | number | boolean;
  unitId?: string;
}

export interface BolProductAttribute {
  id: string;
  values: BolProductAttributeValue[];
}

export interface BolProductAssetVariant {
  usage?: string; // e.g., PRIMARY, SECONDARY
  format?: string; // e.g., image/jpeg
  size?: string; // e.g., LARGE, MEDIUM, SMALL
  url: string;
  width?: number;
  height?: number;
}

export interface BolProductAsset {
  type: string; // e.g., IMAGE_HEADER, IMAGE_P001
  variants: BolProductAssetVariant[];
}

export interface BolProductContent {
  ean: string;
  language: string;
  attributes: BolProductAttribute[];
  assets: BolProductAsset[];
}

// Based on POST /retailer/content/products request body
// (CreateProductContentSingleRequest)
export interface BolCreateProductAttribute {
  id: string;
  values: Array<{ value: string | number | boolean; unitId?: string }>; // Simplified, ensure matches API
}

// Asset creation is more complex (uploading vs referencing).
// For simplicity, we might only update text attributes initially or use a simplified asset update if available.
// This interface is a placeholder for the asset part of the create/update payload.
export interface BolCreateProductAsset {
  type: string; // e.g. "IMAGE_P001"
  // Details depend on how Bol expects assets to be provided (e.g., URL of a new image, reference to existing)
  // For this iteration, we might omit asset updates or simplify heavily.
  // Example: { type: "IMAGE_P001", url: "new_image_url_if_supported_directly" }
  url?: string; // This is a major simplification, Bol's API is likely more complex for assets
}


export interface BolCreateProductContentPayload {
  language: string;
  data: {
    ean: string;
    attributes: BolCreateProductAttribute[];
    assets?: BolCreateProductAsset[]; // Optional, as we might not update assets initially
  };
}


// Define the structure for the Bol API error
interface BolApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  host?: string;
  instance?: string;
  violations?: Array<{
    name?: string;
    reason?: string;
  }>;
}

class BolService {
  private apiClient: AxiosInstance;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiryTime: number | null = null;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    this.apiClient = axios.create({
      baseURL: 'https://api.bol.com/retailer-demo', // Main Retailer API
      headers: {
        'Accept': 'application/vnd.retailer.v10+json', // Default for v10
        'Content-Type': 'application/vnd.retailer.v10+json',
      },
    });

this.apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    config.headers = config.headers ?? {};
    if (!this.isTokenValid()) {
      await this.authenticate();
    }
    if (this.accessToken) {
      config.headers.Authorization = `Bearer ${this.accessToken}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);
  }

  private async authenticate(): Promise<void> {
    try {
      // The token URL is different and uses application/x-www-form-urlencoded
      const tokenClient = axios.create({
        baseURL: 'https://login.bol.com',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const params = new URLSearchParams();
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);
      params.append('grant_type', 'client_credentials');

      const response = await tokenClient.post('/token', params);

      this.accessToken = response.data.access_token;
      // Set expiry time slightly less than actual to be safe (e.g., 50 minutes for a 60-minute token)
      this.tokenExpiryTime = Date.now() + (response.data.expires_in - 60) * 1000;
      console.log('Successfully authenticated with Bol.com API.');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error authenticating with Bol.com API:', axiosError.response?.data || axiosError.message);
      throw new Error(`Authentication failed: ${axiosError.message}`);
    }
  }

  private isTokenValid(): boolean {
    return this.accessToken !== null && this.tokenExpiryTime !== null && Date.now() < this.tokenExpiryTime;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleApiError(error: AxiosError<BolApiError | unknown>, context: string): never {
    if (error.response) {
      const { status, data } = error.response;
      // Type guard for BolApiError
      if (typeof data === 'object' && data !== null && 'title' in data && 'detail' in data) {
        const bolError = data as BolApiError;
        const errorDetails = JSON.stringify(bolError, null, 2);
        console.error(`Error in ${context}: Status ${status}, Data: ${errorDetails}`);
        throw new Error(`Bol API Error in ${context}: ${bolError.title || 'Unknown error'} - ${bolError.detail}`);
      } else {
        // Handle cases where data is not a BolApiError (e.g. plain text, other JSON structure)
        console.error(`Error in ${context}: Status ${status}, Data: ${JSON.stringify(data, null, 2)}`);
        throw new Error(`Bol API Error in ${context}: Status ${status} - Unexpected response structure.`);
      }
    } else if (error.request) {
      console.error(`Error in ${context}: No response received`, error.request);
      throw new Error(`Bol API Error in ${context}: No response from server.`);
    } else {
      console.error(`Error in ${context}:`, error.message);
      throw new Error(`Bol API Error in ${context}: ${error.message}`);
    }
  }

  public async exportOffers(format: 'CSV' = 'CSV'): Promise<string> {
    try {
      // Step 1: Request the offer export
      const exportRequest: OfferExportRequest = { format };
      const exportResponse = await this.apiClient.post<ProcessStatus>('/offers/export', exportRequest);

      const processStatusLink = exportResponse.data.links.find((link: ProcessStatusLink) => link.rel === 'self');
      if (!processStatusLink || !processStatusLink.href) {
        throw new Error('Process status URL not found in export response.');
      }
      const processStatusUrl = processStatusLink.href;
      const processId = exportResponse.data.processStatusId;
      console.log(`Offer export initiated. Process ID: ${processId}`);

      // Step 2: Poll for process status
      let attempts = 0;
      const maxAttempts = 360; // e.g., 5 minutes if polling every 5 seconds
      const pollInterval = 10000; // 5 seconds

      while (attempts < maxAttempts) {
        await this.delay(pollInterval);
        attempts++;
        console.log(`Polling process status for ID ${processId}, attempt ${attempts}`);

        // Use the full URL provided by the API for process status
        // This axios call is outside the apiClient, so it needs its own auth header if not public
        const statusResponse = await axios.get<ProcessStatus>(processStatusUrl, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`, // Assuming this external URL also needs Bearer token
            'Accept': 'application/vnd.retailer.v10+json',
          }
        });
        const currentStatus = statusResponse.data;

        if (currentStatus.status === 'SUCCESS') {
          console.log('Offer export process successful. Entity ID:', currentStatus.entityId);
          if (!currentStatus.entityId) {
            throw new Error('Entity ID (report-id) not found in successful process status.');
          }
          const reportId = currentStatus.entityId;

          // Step 3: Download the actual CSV report using the report-id
          console.log(`Fetching CSV export content from /offers/export/${reportId}`);
          // This request uses the main apiClient, so auth is handled.
          // We need to specify the correct Accept header for CSV.
          // Bol documentation for GET /retailer/offers/export/{report-id} states:
          // Produces: application/vnd.retailer.v10+csv
          const fileResponse = await this.apiClient.get(`/offers/export/${reportId}`, {
            responseType: 'text', // Get as plain text for CSV
            headers: {
              // Overriding the default Accept header of the apiClient for this specific request
              'Accept': 'application/vnd.retailer.v10+csv',
            }
          });
          return fileResponse.data as string; // This should be the CSV content

        } else if (currentStatus.status === 'FAILURE' || currentStatus.status === 'TIMEOUT') {
          console.error(`Offer export process failed or timed out. Status: ${currentStatus.status}, Message: ${currentStatus.errorMessage}`);
          throw new Error(`Offer export process failed or timed out: ${currentStatus.errorMessage || 'No error message provided.'}`);
        }
        // If PENDING, continue polling
        console.log(`Export status: ${currentStatus.status}. Polling again in ${pollInterval/1000}s...`);
      }

      throw new Error('Offer export timed out after maximum polling attempts.');

    } catch (error) {
      this.handleApiError(error as AxiosError<BolApiError>, 'exportOffers');
    }
  }

  public async fetchOrders(
    page: number = 1,
    status: string = 'OPEN', // e.g., OPEN, SHIPPED, ALL
    fulfilmentMethod: 'FBR' | 'FBB' | null = null, // Fulfilment by Retailer or Bol
    latestChangedDate: string | null = null // YYYY-MM-DD format
  ): Promise<BolOrder[]> {
    try {
      const params: Record<string, any> = {
        page,
        status,
      };
      if (fulfilmentMethod) {
        params['fulfilment-method'] = fulfilmentMethod;
      }
      if (latestChangedDate) {
        // Ensure the API expects this format, adjust if necessary
        params['latest-change-date'] = latestChangedDate;
      }

      console.log(`Fetching orders from Bol.com API with params: ${JSON.stringify(params)}`);
      // The actual API response for orders might be { orders: BolOrder[] }
      // Adjust based on the real structure. Assuming it's directly an array for now, or a root object with an 'orders' key.
      const response = await this.apiClient.get<{ orders: BolOrder[] }>('/orders', { params });

      // If the response is structured like { orders: [...] }, then return response.data.orders
      // If the response is directly an array, then return response.data
      // Based on typical Bol API patterns, it's likely nested.
      if (response.data && Array.isArray(response.data.orders)) {
        console.log(`Fetched ${response.data.orders.length} orders for page ${page}.`);
        return response.data.orders;
      } else {
        // This case might indicate an unexpected response structure or an empty page that's not an error
        // but might be structured differently (e.g. just an empty array without the 'orders' key if it's the last page and empty)
        console.log(`No 'orders' array found in response for page ${page}, or response structure differs. Data:`, response.data);
        return []; // Return empty array if no orders found or structure is unexpected but not an error
      }

    } catch (error) {
      this.handleApiError(error as AxiosError<BolApiError>, `fetchOrders (page: ${page}, status: ${status})`);
      return []; // Return empty array on error to allow graceful handling, or rethrow if preferred
    }
  }

  // --- Product Content Methods ---

  public async fetchProductContent(ean: string, language: string = 'nl'): Promise<BolProductContent | null> {
    try {
      // The Accept header for content might be different, e.g. v9 for content.
      // Checking documentation: /retailer/content/products/{ean} seems to use the standard v10 retailer header.
      console.log(`Fetching product content for EAN ${ean}, language ${language} from Bol.com API...`);
      const response = await this.apiClient.get<BolProductContent>(`/content/products/${ean}`, {
        headers: {
          // Ensure correct 'Accept' header if it differs for content API version
          // For now, assuming v10 as per default apiClient setup.
          // 'Accept': 'application/vnd.retailer.v9+json' // Example if it was v9
        },
        params: { language } // Pass language as a query parameter
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<BolApiError>;
      if (axiosError.response && axiosError.response.status === 404) {
        console.log(`Product content not found for EAN ${ean}, language ${language}.`);
        return null; // Not found is a valid case, not necessarily an error to halt everything.
      }
      this.handleApiError(axiosError, `fetchProductContent (ean: ${ean}, lang: ${language})`);
      return null; // Or rethrow depending on desired error handling
    }
  }

  public async upsertProductContent(payload: BolCreateProductContentPayload): Promise<ProcessStatus> {
    try {
      console.log(`Upserting product content for EAN ${payload.data.ean}, language ${payload.language} to Bol.com API...`);
      // This endpoint is asynchronous and returns a ProcessStatus
      const response = await this.apiClient.post<ProcessStatus>('/content/products', payload, {
         headers: {
          // The Content-Type for this specific endpoint might differ, e.g. if it's a specific content version.
          // Bol's doc for POST /content/products uses:
          // 'Content-Type': 'application/vnd.retailer.v9+json'
          // 'Accept': 'application/vnd.retailer.v9+json'
          // This needs to be set specifically for this call if different from client default.
          // For now, let's assume the default v10 is fine, or adjust if testing shows v9 is needed.
          // If v9, the apiClient might need a way to override headers per call or a separate client instance.
          // Let's try with default v10 headers first.
         }
      });
      console.log(`Product content upsert initiated. Process ID: ${response.data.processStatusId}`);
      return response.data; // This is the ProcessStatus object
    } catch (error) {
      this.handleApiError(error as AxiosError<BolApiError>, `upsertProductContent (ean: ${payload.data.ean}, lang: ${payload.language})`);
      // Rethrow or return a specific error structure if needed
      throw error; // Re-throw to allow ShopService to handle it
    }
  }

  public async getProcessStatus(processId: string): Promise<ProcessStatus> {
    // This method was somewhat generic in offer export, can be reused.
    // Ensure the URL is correctly formed or use the link from the initial ProcessStatus response.
    // For now, assuming a direct GET to the generic process status endpoint if the full URL isn't passed.
    // It's better if the calling service (ShopService) constructs the full URL from the link.
    // Here, we'll assume processId is just the ID, and we use the standard endpoint.
    try {
      console.log(`Fetching process status for ID ${processId}`);
      const response = await this.apiClient.get<ProcessStatus>(`/process-status/${processId}`);
      return response.data;
    } catch (error) {
      this.handleApiError(error as AxiosError<BolApiError>, `getProcessStatus (id: ${processId})`);
      throw error;
    }
  }

}

// Example usage (you'll need to replace with actual credentials, likely from env vars)
// const bolClientId = process.env.BOL_CLIENT_ID || 'YOUR_BOL_CLIENT_ID';
// const bolClientSecret = process.env.BOL_CLIENT_SECRET || 'YOUR_BOL_CLIENT_SECRET';

// export const bolService = new BolService(bolClientId, bolClientSecret);

export default BolService;
