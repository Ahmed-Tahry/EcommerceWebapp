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
