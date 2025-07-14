import { Transaction, Op } from 'sequelize';
import { VatRule } from '../models';
import { sequelize } from '../config/database';

// Types for VAT operations
export interface VatRuleRequest {
  name: string;
  rate: number;
  country_code: string;
  is_default?: boolean;
  is_active?: boolean;
  description?: string;
}

export interface VatCalculationRequest {
  amount: number;
  country_code: string;
  customer_vat_number?: string;
  is_b2b?: boolean;
}

export interface VatCalculationResponse {
  vat_rate: number;
  vat_amount: number;
  amount_excl_vat: number;
  amount_incl_vat: number;
  vat_rule: VatRuleAttributes;
  is_reverse_charge: boolean;
}

export interface EUVatValidationResult {
  is_valid: boolean;
  country_code?: string;
  error?: string;
}

export class VatService {
  /**
   * Create a new VAT rule
   */
  async createVatRule(data: VatRuleRequest, transaction?: Transaction): Promise<VatRule> {
    const t = transaction || await sequelize.transaction();
    
    try {
      // Validate country code
      if (!this.isValidCountryCode(data.country_code)) {
        throw new Error('Invalid country code');
      }
      
      // Validate VAT rate
      if (data.rate < 0 || data.rate > 100) {
        throw new Error('VAT rate must be between 0 and 100');
      }
      
      // If this is a default rule, unset other default rules for the same country
      if (data.is_default) {
        await VatRule.update(
          { is_default: false },
          { 
            where: { country_code: data.country_code },
            transaction: t 
          }
        );
      }
      
      const vatRule = await VatRule.create({
        name: data.name,
        rate: data.rate,
        country_code: data.country_code.toUpperCase(),
        is_default: data.is_default || false,
        is_active: data.is_active !== false, // Default to true
        description: data.description
      }, { transaction: t });
      
      if (!transaction) {
        await t.commit();
      }
      
      return vatRule;
      
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }
  
  /**
   * Update an existing VAT rule
   */
  async updateVatRule(
    id: string,
    data: Partial<VatRuleRequest>,
    transaction?: Transaction
  ): Promise<VatRule> {
    const t = transaction || await sequelize.transaction();
    
    try {
      const vatRule = await VatRule.findByPk(id);
      if (!vatRule) {
        throw new Error('VAT rule not found');
      }
      
      // Validate country code if provided
      if (data.country_code && !this.isValidCountryCode(data.country_code)) {
        throw new Error('Invalid country code');
      }
      
      // Validate VAT rate if provided
      if (data.rate !== undefined && (data.rate < 0 || data.rate > 100)) {
        throw new Error('VAT rate must be between 0 and 100');
      }
      
      // If setting as default, unset other default rules for the same country
      if (data.is_default) {
        const countryCode = data.country_code || vatRule.country_code;
        await VatRule.update(
          { is_default: false },
          { 
            where: { 
              country_code: countryCode,
              id: { [Op.ne]: id }
            },
            transaction: t 
          }
        );
      }
      
      await vatRule.update(data, { transaction: t });
      
      if (!transaction) {
        await t.commit();
      }
      
      return vatRule;
      
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }
  
  /**
   * Delete a VAT rule
   */
  async deleteVatRule(id: string, transaction?: Transaction): Promise<void> {
    const t = transaction || await sequelize.transaction();
    
    try {
      const vatRule = await VatRule.findByPk(id);
      if (!vatRule) {
        throw new Error('VAT rule not found');
      }
      
      // Check if this is the only VAT rule for the country
      const count = await VatRule.count({
        where: { country_code: vatRule.country_code }
      });
      
      if (count === 1) {
        throw new Error('Cannot delete the only VAT rule for a country');
      }
      
      await vatRule.destroy({ transaction: t });
      
      if (!transaction) {
        await t.commit();
      }
      
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }
  
  /**
   * Get VAT rule by ID
   */
  async getVatRule(id: string): Promise<VatRule | null> {
    return await VatRule.findByPk(id);
  }
  
  /**
   * Get VAT rules by country
   */
  async getVatRulesByCountry(country_code: string): Promise<VatRule[]> {
    return await VatRule.findAll({
      where: { 
        country_code: country_code.toUpperCase(),
        is_active: true
      },
      order: [['is_default', 'DESC'], ['name', 'ASC']]
    });
  }
  
  /**
   * Get all active VAT rules
   */
  async getAllVatRules(): Promise<VatRule[]> {
    return await VatRule.findAll({
      where: { is_active: true },
      order: [['country_code', 'ASC'], ['is_default', 'DESC'], ['name', 'ASC']]
    });
  }
  
  /**
   * Get default VAT rule for a country
   */
  async getDefaultVatRule(country_code: string): Promise<VatRule | null> {
    return await VatRule.findOne({
      where: { 
        country_code: country_code.toUpperCase(),
        is_default: true,
        is_active: true
      }
    });
  }
  
  /**
   * Calculate VAT for an amount
   */
  async calculateVat(request: VatCalculationRequest): Promise<VatCalculationResponse> {
    const { amount, country_code, customer_vat_number, is_b2b } = request;
    
    // Get appropriate VAT rule
    const vatRule = await this.getVatRuleForCalculation(country_code, customer_vat_number, is_b2b);
    
    const vatRate = parseFloat(vatRule.rate);
    const isReverseCharge = vatRule.name.toLowerCase().includes('reverse charge');
    
    let vatAmount = 0;
    let amountExclVat = amount;
    let amountInclVat = amount;
    
    if (isReverseCharge) {
      // Reverse charge: no VAT applied
      vatAmount = 0;
      amountExclVat = amount;
      amountInclVat = amount;
    } else if (vatRate > 0) {
      // Standard VAT calculation
      amountExclVat = amount / (1 + vatRate / 100);
      vatAmount = amount - amountExclVat;
      amountInclVat = amount;
    }
    
    return {
      vat_rate: vatRate,
      vat_amount: vatAmount,
      amount_excl_vat: amountExclVat,
      amount_incl_vat: amountInclVat,
      vat_rule: vatRule.toJSON(),
      is_reverse_charge: isReverseCharge
    };
  }
  
  /**
   * Get appropriate VAT rule for calculation
   */
  private async getVatRuleForCalculation(
    country_code: string,
    customer_vat_number?: string,
    is_b2b?: boolean
  ): Promise<VatRule> {
    // Check for reverse charge (B2B EU transactions with VAT number)
    if (is_b2b && customer_vat_number && this.isEUCountry(country_code)) {
      const reverseChargeRule = await VatRule.findOne({
        where: { 
          country_code: country_code.toUpperCase(),
          name: { [Op.iLike]: '%reverse charge%' }
        }
      });
      if (reverseChargeRule) {
        return reverseChargeRule;
      }
    }
    
    // Get default VAT rule for country
    const defaultRule = await this.getDefaultVatRule(country_code);
    if (defaultRule) {
      return defaultRule;
    }
    
    // Fallback to any active rule for the country
    const anyRule = await VatRule.findOne({
      where: { 
        country_code: country_code.toUpperCase(),
        is_active: true
      }
    });
    
    if (anyRule) {
      return anyRule;
    }
    
    // Final fallback to global default
    const globalDefault = await VatRule.findOne({
      where: { is_default: true, is_active: true }
    });
    
    if (!globalDefault) {
      throw new Error(`No VAT rule found for country ${country_code}`);
    }
    
    return globalDefault;
  }
  
  /**
   * Validate EU VAT number format
   */
  validateEUVatNumber(vatNumber: string): EUVatValidationResult {
    // Remove spaces and convert to uppercase
    const cleanVat = vatNumber.replace(/\s/g, '').toUpperCase();
    
    // Basic EU VAT number format validation
    const euVatPattern = /^[A-Z]{2}[0-9A-Z]+$/;
    
    if (!euVatPattern.test(cleanVat)) {
      return {
        is_valid: false,
        error: 'Invalid EU VAT number format'
      };
    }
    
    // Extract country code
    const countryCode = cleanVat.substring(0, 2);
    
    // Check if it's a valid EU country
    if (!this.isEUCountry(countryCode)) {
      return {
        is_valid: false,
        error: 'Invalid EU country code'
      };
    }
    
    return {
      is_valid: true,
      country_code: countryCode
    };
  }
  
  /**
   * Check if country is in EU
   */
  isEUCountry(country_code: string): boolean {
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
    ];
    return euCountries.includes(country_code.toUpperCase());
  }
  
  /**
   * Validate country code format
   */
  private isValidCountryCode(country_code: string): boolean {
    // ISO 3166-1 alpha-2 format (2 uppercase letters)
    const countryPattern = /^[A-Z]{2}$/;
    return countryPattern.test(country_code);
  }
  
  /**
   * Get EU VAT rates for all countries
   */
  async getEUVatRates(): Promise<Record<string, number>> {
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
    ];
    
    const rates: Record<string, number> = {};
    
    for (const country of euCountries) {
      const defaultRule = await this.getDefaultVatRule(country);
      if (defaultRule) {
        rates[country] = parseFloat(defaultRule.rate);
      }
    }
    
    return rates;
  }
  
  /**
   * Initialize default VAT rules for EU countries
   */
  async initializeDefaultEUVatRules(): Promise<void> {
    const defaultRates = {
      'AT': 20, 'BE': 21, 'BG': 20, 'HR': 25, 'CY': 19, 'CZ': 21,
      'DK': 25, 'EE': 20, 'FI': 24, 'FR': 20, 'DE': 19, 'GR': 24,
      'HU': 27, 'IE': 23, 'IT': 22, 'LV': 21, 'LT': 21, 'LU': 17,
      'MT': 18, 'NL': 21, 'PL': 23, 'PT': 23, 'RO': 19, 'SK': 20,
      'SI': 22, 'ES': 21, 'SE': 25
    };
    
    for (const [country, rate] of Object.entries(defaultRates)) {
      // Check if default rule already exists
      const existingRule = await this.getDefaultVatRule(country);
      if (!existingRule) {
              await this.createVatRule({
        name: `Standard VAT ${country}`,
        rate: rate,
        country_code: country,
        is_default: true,
        description: `Standard VAT rate for ${country}`
      });
      }
    }
  }
  
  /**
   * Bulk update VAT rates
   */
  async bulkUpdateVatRates(updates: Array<{ country_code: string; rate: number }>): Promise<void> {
    const t = await sequelize.transaction();
    
    try {
      for (const update of updates) {
        const defaultRule = await this.getDefaultVatRule(update.country_code);
        if (defaultRule) {
          await defaultRule.update({ rate: update.rate }, { transaction: t });
        }
      }
      
      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

export default new VatService(); 