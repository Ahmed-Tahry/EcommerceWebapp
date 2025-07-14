export interface IAccountDetails {
  id: string; // Auto-generated UUID a PKeach row
  userId: string; // From Keycloak (X-User-ID), should be unique for each user's settings
  bolClientId: string | null;
  bolClientSecret: string | null; // Store securely (e.g., encrypted or use a vault)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserOnboardingStatus {
  userId: string; // PK, from Keycloak (X-User-ID)
  hasConfiguredBolApi: boolean;
  hasCompletedShopSync: boolean;
  hasCompletedVatSetup: boolean;
  hasCompletedInvoiceSetup: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
  vatNumber: string | null;
  defaultInvoiceNotes: string | null;
  invoicePrefix?: string | null; // e.g., "INV-"
  nextInvoiceNumber?: number; // To auto-increment invoice numbers
  createdAt?: Date;
  updatedAt?: Date;
}
