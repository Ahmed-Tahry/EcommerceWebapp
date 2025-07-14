// Core services
export { default as settingsService } from './settingsService';
export { default as shopService } from './shopService';
export { default as bolApiService } from './bolApiService';
export { default as invoiceService } from './invoiceService';
export { default as vatService } from './vatService';
export { default as templateService } from './templateService';

// Export types
export type {
  AccountDetails,
  VatSetting,
  InvoiceSettings,
  UserOnboardingStatus
} from './settingsService';

export type {
  Order,
  OrderItem,
  CustomerInfo,
  Product,
  Shipment,
  ShipmentItem,
  Offer
} from './shopService';

export type {
  BolApiCredentials,
  BolApiToken,
  BolOrder,
  BolOrderItem,
  BolCustomerDetails,
  BolShipment,
  BolShipmentItem,
  BolTransport,
  BolInvoiceRequest,
  BolInvoiceItem,
  BolSellerDetails
} from './bolApiService';

export type {
  InvoiceGenerationRequest,
  InvoiceGenerationResult,
  VatCalculationResult,
  InvoiceNumberGenerationOptions
} from './invoiceService';

export type {
  VatRuleRequest,
  VatCalculationRequest,
  VatCalculationResponse,
  EUVatValidationResult
} from './vatService';

export type {
  TemplateRequest,
  TemplatePreviewRequest,
  TemplatePreviewResponse
} from './templateService';

// HTTP client utilities
export {
  HttpClient,
  ServiceError,
  handleServiceError,
  createSettingsServiceClient,
  createShopServiceClient
} from '@/utils/httpClient'; 