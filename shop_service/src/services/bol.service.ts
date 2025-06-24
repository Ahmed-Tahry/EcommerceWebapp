import axios, { AxiosInstance, AxiosError } from 'axios';

// Define the structure for the process status response
interface ProcessStatus {
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
      baseURL: 'https://api.bol.com/retailer', // Main Retailer API
      headers: {
        'Accept': 'application/vnd.retailer.v10+json', // Default for v10
        'Content-Type': 'application/vnd.retailer.v10+json',
      },
    });

    this.apiClient.interceptors.request.use(
      async (config) => {
        if (!this.isTokenValid()) {
          await this.authenticate();
        }
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
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

  private handleApiError(error: AxiosError<BolApiError>, context: string): never {
    if (error.response) {
      const { status, data } = error.response;
      const errorDetails = JSON.stringify(data, null, 2);
      console.error(`Error in ${context}: Status ${status}, Data: ${errorDetails}`);
      throw new Error(`Bol API Error in ${context}: ${data.title || 'Unknown error'} - ${data.detail}`);
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

      const processStatusUrl = exportResponse.data.links.find(link => link.rel === 'self')?.href;
      if (!processStatusUrl) {
        throw new Error('Process status URL not found in export response.');
      }
      const processId = exportResponse.data.processStatusId;
      console.log(`Offer export initiated. Process ID: ${processId}`);

      // Step 2: Poll for process status
      let attempts = 0;
      const maxAttempts = 60; // e.g., 5 minutes if polling every 5 seconds
      const pollInterval = 5000; // 5 seconds

      while (attempts < maxAttempts) {
        await this.delay(pollInterval);
        attempts++;
        console.log(`Polling process status for ID ${processId}, attempt ${attempts}`);

        // Use the full URL provided by the API for process status
        const statusResponse = await axios.get<ProcessStatus>(processStatusUrl, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/vnd.retailer.v10+json', // Ensure correct accept header for this specific call
          }
        });
        const currentStatus = statusResponse.data;

        if (currentStatus.status === 'SUCCESS') {
          console.log('Offer export successful.');
          const downloadLink = currentStatus.links.find(link => link.rel === 'download')?.href;
          if (!downloadLink) {
            throw new Error('Download link not found in successful process status.');
          }

          // Step 3: Download the file
          // The download link might be for a different domain or require different headers (e.g. no auth)
          // For now, assume it's a direct GET and might not need Bol API auth headers
          console.log(`Downloading CSV from: ${downloadLink}`);
          const fileResponse = await axios.get(downloadLink, {
            responseType: 'text', // Get as plain text for CSV
            // It's possible Bol's download links don't require the same auth/content-type headers
            // If downloads fail, this is an area to investigate.
            // For now, let's try without specific Bol API headers.
          });
          return fileResponse.data as string;

        } else if (currentStatus.status === 'FAILURE' || currentStatus.status === 'TIMEOUT') {
          console.error(`Offer export failed or timed out. Status: ${currentStatus.status}, Message: ${currentStatus.errorMessage}`);
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
}

// Example usage (you'll need to replace with actual credentials, likely from env vars)
// const bolClientId = process.env.BOL_CLIENT_ID || 'YOUR_BOL_CLIENT_ID';
// const bolClientSecret = process.env.BOL_CLIENT_SECRET || 'YOUR_BOL_CLIENT_SECRET';

// export const bolService = new BolService(bolClientId, bolClientSecret);

export default BolService;
