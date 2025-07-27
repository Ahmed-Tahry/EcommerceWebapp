export interface IAccountDetails {
  id: string; // Auto-generated UUID a PKeach row
  userId: string; // From Keycloak (X-User-ID), should be unique for each user's settings
  bolClientId: string | null;
  bolClientSecret: string | null; // Store securely (e.g., encrypted or use a vault)
  salesNumber?: string | null;
  status?: string | null;
  apiCredentials?: Record<string, any> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserOnboardingStatus {
  userId: string;
  hasConfiguredBolApi: boolean;
  hasCompletedShopSync: boolean;
  hasCompletedInvoiceSetup: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface IVatSetting {
  id: string; // UUID, auto-generated
  name: string; // e.g., "High Rate", "Low Rate", "Zero Rate"
  rate: number; // e.g., 21, 9, 0 (representing percentage)
  isDefault?: boolean; // Optional: To mark one VAT rate as default
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInvoiceSettings {
  userId: string; // User ID (primary key)
  companyName: string | null;
  companyAddress: string | null; // Could be structured address object later
  companyPhone?: string | null;
  companyEmail?: string | null;
  vatNumber: string | null;
  defaultInvoiceNotes: string | null;
  invoicePrefix?: string | null; // e.g., "INV-"
  nextInvoiceNumber?: number; // To auto-increment invoice numbers
  bankAccount?: string;
  startNumber?: string;
  fileNameBase?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGeneralSettings {
  userId: string;
  firstname: string;
  surname: string;
  address: string;
  postcode: string;
  city: string;
  accountEmail: string;
  phoneNumber?: string;
  companyName: string;
  companyAddress: string;
  companyPostcode: string;
  companyCity: string;
  customerEmail: string;
  companyPhoneNumber?: string;
  chamberOfCommerce: string;
  vatNumber: string;
  iban?: string;
  optionalVatNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
