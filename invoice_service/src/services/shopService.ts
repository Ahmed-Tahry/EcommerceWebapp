import { createShopServiceClient, handleServiceError } from '@/utils/httpClient';

// Types for shop service responses
export interface Order {
  orderId: string;
  orderPlacedDateTime: string;
  orderItems: OrderItem[];
  customerInfo?: CustomerInfo;
  totalAmount?: number;
  currency?: string;
}

export interface OrderItem {
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

export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  vatNumber?: string;
}

export interface Product {
  ean: string;
  title: string;
  description?: string;
  brand?: string;
  mainImageUrl?: string;
  vatRate?: number;
  attributes?: Record<string, any>;
}

export interface Shipment {
  shipmentId: string;
  orderId: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippingMethod?: string;
  shippedAt?: string;
  deliveredAt?: string;
  items: ShipmentItem[];
}

export interface ShipmentItem {
  orderItemId: string;
  ean: string;
  quantity: number;
  shippedQuantity: number;
}

export interface Offer {
  offerId: string;
  ean: string;
  price: number;
  stockAmount: number;
  conditionName?: string;
  fulfilmentType?: string;
}

class ShopService {
  private client = createShopServiceClient();

  // Set user context for all requests
  setUserContext(userId: string, userRoles?: string): void {
    this.client.setUserContext(userId, userRoles);
  }

  // Get order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const response = await this.client.get<Order>(`/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      return handleServiceError(error, 'Shop');
    }
  }

  // Get all orders for a user
  async getOrders(page: number = 1, limit: number = 50): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
    try {
      const response = await this.client.get<{ orders: Order[]; total: number; page: number; limit: number }>(
        `/orders?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Shop');
    }
  }

  // Get orders by status
  async getOrdersByStatus(status: string, page: number = 1, limit: number = 50): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
    try {
      const response = await this.client.get<{ orders: Order[]; total: number; page: number; limit: number }>(
        `/orders?status=${status}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Shop');
    }
  }

  // Get product by EAN
  async getProduct(ean: string): Promise<Product | null> {
    try {
      const response = await this.client.get<Product>(`/products/${ean}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      return handleServiceError(error, 'Shop');
    }
  }

  // Get multiple products by EANs
  async getProducts(eans: string[]): Promise<Product[]> {
    try {
      const response = await this.client.post<Product[]>('/products/batch', { eans });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Shop');
    }
  }

  // Get offer by ID
  async getOffer(offerId: string): Promise<Offer | null> {
    try {
      const response = await this.client.get<Offer>(`/offers/${offerId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      return handleServiceError(error, 'Shop');
    }
  }

  // Get offers by EAN
  async getOffersByEan(ean: string): Promise<Offer[]> {
    try {
      const response = await this.client.get<Offer[]>(`/offers?ean=${ean}`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Shop');
    }
  }

  // Get shipment by ID
  async getShipment(shipmentId: string): Promise<Shipment | null> {
    try {
      const response = await this.client.get<Shipment>(`/shipments/${shipmentId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      return handleServiceError(error, 'Shop');
    }
  }

  // Get shipments by order ID
  async getShipmentsByOrder(orderId: string): Promise<Shipment[]> {
    try {
      const response = await this.client.get<Shipment[]>(`/shipments?orderId=${orderId}`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Shop');
    }
  }

  // Create shipment
  async createShipment(shipmentData: Partial<Shipment>): Promise<Shipment> {
    try {
      const response = await this.client.post<Shipment>('/shipments', shipmentData);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Shop');
    }
  }

  // Update shipment status
  async updateShipmentStatus(shipmentId: string, status: Shipment['status'], trackingNumber?: string): Promise<Shipment> {
    try {
      const response = await this.client.put<Shipment>(`/shipments/${shipmentId}`, {
        status,
        trackingNumber,
        ...(status === 'shipped' && { shippedAt: new Date().toISOString() }),
        ...(status === 'delivered' && { deliveredAt: new Date().toISOString() })
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Shop');
    }
  }

  // Sync orders from Bol.com
  async syncBolOrders(status?: string, fulfilmentMethod?: string, latestChangedDate?: string): Promise<{
    createdOrders: number;
    updatedOrders: number;
    createdItems: number;
    updatedItems: number;
    failedOrders: number;
    errors: string[];
  }> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (fulfilmentMethod) params.append('fulfilmentMethod', fulfilmentMethod);
      if (latestChangedDate) params.append('latestChangedDate', latestChangedDate);

      const response = await this.client.post<{
        createdOrders: number;
        updatedOrders: number;
        createdItems: number;
        updatedItems: number;
        failedOrders: number;
        errors: string[];
      }>(`/orders/sync-bol?${params.toString()}`);
      
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Shop');
    }
  }

  // Get order with full details (order + items + customer info)
  async getOrderWithDetails(orderId: string): Promise<Order | null> {
    try {
      const order = await this.getOrder(orderId);
      if (!order) return null;

      // Enhance order with product details
      const enhancedOrder = { ...order };
      enhancedOrder.orderItems = await Promise.all(
        order.orderItems.map(async (item) => {
          const product = await this.getProduct(item.ean);
          return {
            ...item,
            productName: product?.title || item.productName,
            brand: product?.brand,
            vatRate: product?.vatRate
          };
        })
      );

      return enhancedOrder;
    } catch (error) {
      return handleServiceError(error, 'Shop');
    }
  }

  // Health check for shop service
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Shop service health check failed:', error);
      return false;
    }
  }
}

export default new ShopService(); 