// Placeholder for ShopModel (Phase 1)

export interface IShop {
  id: string;
  name: string;
  description?: string;
}

// New table interfaces

export interface IOffer {
  offerId: string; // primary key
  ean: string; // not null
  conditionName?: string;
  conditionCategory?: string;
  conditionComment?: string; // text in SQL
  bundlePricesPrice?: number; // decimal in SQL
  fulfilmentDeliveryCode?: string;
  stockAmount?: number; // integer in SQL
  onHoldByRetailer?: boolean;
  fulfilmentType?: string;
  mutationDateTime?: Date; // datetime in SQL
  referenceCode?: string;
  correctedStock?: number; // integer in SQL
}

export interface IOrder {
  orderId: string; // primary key
  orderPlacedDateTime: Date; // not null, datetime in SQL
  orderItems: IOrderItem[] | string; // JSONB in SQL, can be stringified JSON or actual objects
}

export interface IOrderItem {
  orderItemId: string; // primary key
  orderId: string; // foreign key referencing orders table
  ean: string; // not null
  fulfilmentMethod?: string;
  fulfilmentStatus?: string;
  quantity?: number; // integer in SQL
  quantityShipped?: number; // integer in SQL
  quantityCancelled?: number; // integer in SQL
  cancellationRequest?: boolean;
  latestChangedDateTime?: Date; // datetime in SQL
}

// Represents basic product information, potentially synced with Bol.com product content
export interface IProduct {
  ean: string; // Primary Key, EAN of the product
  title?: string | null;
  description?: string | null;
  brand?: string | null;
  // For simplicity, storing main image URL directly. Bol's asset structure is more complex.
  mainImageUrl?: string | null;
  // Storing other attributes as a flexible JSON object for now.
  // Specific, frequently used attributes could be promoted to top-level fields if needed.
  attributes?: Record<string, any> | null; // To store other Bol attributes like dimensions, series, etc.
  lastSyncFromBol?: Date | null; // Timestamp of the last successful sync from Bol
  lastSyncToBol?: Date | null;   // Timestamp of the last successful push to Bol
}
