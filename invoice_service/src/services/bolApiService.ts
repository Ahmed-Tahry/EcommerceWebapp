import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import settingsService from '@/services/settingsService';

// Bol.com API types
export interface BolApiCredentials {
  clientId: string;
  clientSecret: string;
}

export interface BolApiToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

export interface BolOrder {
  orderId: string;
  orderPlacedDateTime: string;
  orderItems: BolOrderItem[];
  customerDetails?: BolCustomerDetails;
  totalAmount?: number;
  currency?: string;
  fulfilmentMethod?: string;
  status?: string;
}

export interface BolOrderItem {
  orderItemId: string;
  ean: string;
  productName?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  fulfilmentMethod?: string;
  fulfilmentStatus?: string;
  latestChangedDateTime?: string;
}

export interface BolCustomerDetails {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  vatNumber?: string;
}

export interface BolShipment {
  shipmentId: string;
  orderId: string;
  orderItems: BolShipmentItem[];
  transport?: BolTransport;
  customerDetails?: BolCustomerDetails;
}

export interface BolShipmentItem {
  orderItemId: string;
  ean: string;
  quantity: number;
  shippedQuantity: number;
}

export interface BolTransport {
  transportId: string;
  transporterCode: string;
  trackAndTrace: string;
  estimatedDeliveryDate?: string;
}

export interface BolInvoiceRequest {
  orderId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  items: BolInvoiceItem[];
  customerDetails: BolCustomerDetails;
  sellerDetails: BolSellerDetails;
}

export interface BolInvoiceItem {
  ean: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  vatRate: number;
  vatAmount: number;
}

export interface BolSellerDetails {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  vatNumber: string;
  kvkNumber?: string;
  iban?: string;
}

class BolApiService {
  private client: AxiosInstance;
  private token: BolApiToken | null = null;
  private tokenExpiry: number = 0;
  private settingsClient = settingsService;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.bol.com',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.retailer.v10+json'
      }
    });
  }

  // Set user context for settings service
  setUserContext(userId: string, userRoles?: string): void {
    this.settingsClient.setUserContext(userId, userRoles);
  }

  // Get or refresh access token
  private async getAccessToken(userId: string): Promise<string> {
    const now = Date.now();
    
    // Check if we have a valid token
    if (this.token && now < this.tokenExpiry) {
      return this.token.access_token;
    }

    // Get credentials from settings service
    const credentials = await this.settingsClient.getBolCredentials(userId);
    
    // Request new token
    try {
      const response = await axios.post<BolApiToken>(
        'https://login.bol.com/token',
        {
          grant_type: 'client_credentials',
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.token = response.data;
      this.tokenExpiry = now + (this.token.expires_in * 1000) - 60000; // Expire 1 minute early
      
      return this.token.access_token;
    } catch (error) {
      throw new Error(`Failed to get Bol.com access token: ${error}`);
    }
  }

  // Set authorization header for requests
  private async setAuthHeader(userId: string): Promise<void> {
    const token = await this.getAccessToken(userId);
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Get order by ID
  async getOrder(userId: string, orderId: string): Promise<BolOrder | null> {
    try {
      await this.setAuthHeader(userId);
      const response = await this.client.get<BolOrder>(`/retailer/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get Bol.com order: ${error.message}`);
    }
  }

  // Get orders with filters
  async getOrders(
    userId: string,
    page: number = 1,
    limit: number = 50,
    status?: string,
    fulfilmentMethod?: string,
    latestChangedDate?: string
  ): Promise<{ orders: BolOrder[]; total: number; page: number; limit: number }> {
    try {
      await this.setAuthHeader(userId);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status) params.append('status', status);
      if (fulfilmentMethod) params.append('fulfilmentMethod', fulfilmentMethod);
      if (latestChangedDate) params.append('latestChangedDate', latestChangedDate);

      const response = await this.client.get<{ orders: BolOrder[]; total: number; page: number; limit: number }>(
        `/retailer/orders?${params.toString()}`
      );
      
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get Bol.com orders: ${error.message}`);
    }
  }

  // Get shipment by ID
  async getShipment(userId: string, shipmentId: string): Promise<BolShipment | null> {
    try {
      await this.setAuthHeader(userId);
      const response = await this.client.get<BolShipment>(`/retailer/shipments/${shipmentId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get Bol.com shipment: ${error.message}`);
    }
  }

  // Get shipments by order ID
  async getShipmentsByOrder(userId: string, orderId: string): Promise<BolShipment[]> {
    try {
      await this.setAuthHeader(userId);
      const response = await this.client.get<BolShipment[]>(`/retailer/shipments?orderId=${orderId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get Bol.com shipments: ${error.message}`);
    }
  }

  // Create shipment
  async createShipment(userId: string, shipmentData: Partial<BolShipment>): Promise<BolShipment> {
    try {
      await this.setAuthHeader(userId);
      const response = await this.client.post<BolShipment>('/retailer/shipments', shipmentData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create Bol.com shipment: ${error.message}`);
    }
  }

  // Update shipment status
  async updateShipmentStatus(
    userId: string,
    shipmentId: string,
    status: string,
    trackAndTrace?: string
  ): Promise<BolShipment> {
    try {
      await this.setAuthHeader(userId);
      const response = await this.client.put<BolShipment>(`/retailer/shipments/${shipmentId}`, {
        status,
        trackAndTrace
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to update Bol.com shipment: ${error.message}`);
    }
  }

  // Submit invoice to Bol.com
  async submitInvoice(userId: string, invoiceRequest: BolInvoiceRequest): Promise<{ invoiceId: string; status: string }> {
    try {
      await this.setAuthHeader(userId);
      const response = await this.client.post<{ invoiceId: string; status: string }>(
        '/retailer/invoices',
        invoiceRequest
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to submit invoice to Bol.com: ${error.message}`);
    }
  }

  // Get invoice status
  async getInvoiceStatus(userId: string, invoiceId: string): Promise<{ status: string; message?: string }> {
    try {
      await this.setAuthHeader(userId);
      const response = await this.client.get<{ status: string; message?: string }>(
        `/retailer/invoices/${invoiceId}/status`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get invoice status: ${error.message}`);
    }
  }

  // Get product details by EAN
  async getProduct(userId: string, ean: string): Promise<{
    ean: string;
    title: string;
    description?: string;
    brand?: string;
    mainImageUrl?: string;
    vatRate?: number;
  } | null> {
    try {
      await this.setAuthHeader(userId);
      const response = await this.client.get<{
        ean: string;
        title: string;
        description?: string;
        brand?: string;
        mainImageUrl?: string;
        vatRate?: number;
      }>(`/retailer/products/${ean}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get Bol.com product: ${error.message}`);
    }
  }

  // Get offer details by EAN
  async getOffer(userId: string, ean: string): Promise<{
    offerId: string;
    ean: string;
    price: number;
    stockAmount: number;
    conditionName?: string;
    fulfilmentType?: string;
  } | null> {
    try {
      await this.setAuthHeader(userId);
      const response = await this.client.get<{
        offerId: string;
        ean: string;
        price: number;
        stockAmount: number;
        conditionName?: string;
        fulfilmentType?: string;
      }>(`/retailer/offers/${ean}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to get Bol.com offer: ${error.message}`);
    }
  }

  // Health check for Bol.com API
  async healthCheck(userId: string): Promise<boolean> {
    try {
      await this.setAuthHeader(userId);
      const response = await this.client.get('/retailer/orders?page=1&limit=1');
      return response.status === 200;
    } catch (error) {
      console.error('Bol.com API health check failed:', error);
      return false;
    }
  }
}

export default new BolApiService(); 