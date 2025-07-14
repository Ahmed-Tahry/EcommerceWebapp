import { createSettingsServiceClient, handleServiceError } from '@/utils/httpClient';

// Types for settings service responses
export interface AccountDetails {
  id: number;
  userId: string;
  bolClientId: string | null;
  bolClientSecret: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VatSetting {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceSettings {
  id: string;
  userId: string;
  invoiceNumberPrefix: string;
  invoiceNumberStart: number;
  invoiceNumberFormat: string;
  emailSubjectTemplate: string;
  emailBodyTemplate: string;
  autoSendEmail: boolean;
  defaultCurrency: string;
  defaultLanguage: 'nl' | 'fr' | 'en';
  defaultPaymentTerms: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserOnboardingStatus {
  userId: string;
  hasConfiguredBolApi: boolean;
  hasCompletedShopSync: boolean;
  hasCompletedVatSetup: boolean;
  hasCompletedInvoiceSetup: boolean;
  createdAt: string;
  updatedAt: string;
}

class SettingsService {
  private client = createSettingsServiceClient();

  // Set user context for all requests
  setUserContext(userId: string, userRoles?: string): void {
    this.client.setUserContext(userId, userRoles);
  }

  // Get Bol.com credentials for a user
  async getBolCredentials(userId: string): Promise<{ clientId: string; clientSecret: string }> {
    try {
      const response = await this.client.get<AccountDetails>(`/account-details?userId=${userId}`);
      
      if (!response.data.bolClientId || !response.data.bolClientSecret) {
        throw new Error('Bol.com credentials not configured for this user');
      }

      return {
        clientId: response.data.bolClientId,
        clientSecret: response.data.bolClientSecret
      };
    } catch (error) {
      return handleServiceError(error, 'Settings');
    }
  }

  // Get VAT settings
  async getVatSettings(): Promise<VatSetting[]> {
    try {
      const response = await this.client.get<VatSetting[]>('/vat-settings');
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Settings');
    }
  }

  // Get default VAT setting
  async getDefaultVatSetting(): Promise<VatSetting | null> {
    try {
      const vatSettings = await this.getVatSettings();
      return vatSettings.find(setting => setting.isDefault) || null;
    } catch (error) {
      return handleServiceError(error, 'Settings');
    }
  }

  // Get VAT setting by country code
  async getVatSettingByCountry(countryCode: string): Promise<VatSetting | null> {
    try {
      const vatSettings = await this.getVatSettings();
      // Note: This assumes VAT settings have country_code field
      // You might need to adjust based on actual settings service structure
      return vatSettings.find(setting => 
        (setting as any).countryCode === countryCode
      ) || null;
    } catch (error) {
      return handleServiceError(error, 'Settings');
    }
  }

  // Get user invoice settings
  async getUserInvoiceSettings(userId: string): Promise<InvoiceSettings | null> {
    try {
      const response = await this.client.get<InvoiceSettings>(`/invoice-settings?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // User has no settings yet
      }
      return handleServiceError(error, 'Settings');
    }
  }

  // Create or update user invoice settings
  async saveUserInvoiceSettings(userId: string, settings: Partial<InvoiceSettings>): Promise<InvoiceSettings> {
    try {
      const response = await this.client.put<InvoiceSettings>('/invoice-settings', {
        userId,
        ...settings
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Settings');
    }
  }

  // Get user onboarding status
  async getUserOnboardingStatus(userId: string): Promise<UserOnboardingStatus> {
    try {
      const response = await this.client.get<UserOnboardingStatus>(`/onboarding-status?userId=${userId}`);
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Settings');
    }
  }

  // Update user onboarding status
  async updateUserOnboardingStatus(userId: string, updates: Partial<UserOnboardingStatus>): Promise<UserOnboardingStatus> {
    try {
      const response = await this.client.put<UserOnboardingStatus>('/onboarding-status', {
        userId,
        ...updates
      });
      return response.data;
    } catch (error) {
      return handleServiceError(error, 'Settings');
    }
  }

  // Validate VAT number using external service (if available)
  async validateVatNumber(vatNumber: string, countryCode: string): Promise<boolean> {
    try {
      // This would typically call an external VAT validation service
      // For now, we'll implement a basic validation
      const response = await this.client.post<{ valid: boolean }>('/vat-validation', {
        vatNumber,
        countryCode
      });
      return response.data.valid;
    } catch (error) {
      // If VAT validation service is not available, return true for now
      console.warn('VAT validation service not available, skipping validation');
      return true;
    }
  }

  // Health check for settings service
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Settings service health check failed:', error);
      return false;
    }
  }
}

export default new SettingsService(); 