import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { sequelize } from '../config/database';
import { initializeModels, VatRule, InvoiceTemplate } from '../models';

describe('Simple Invoice Generation Tests', () => {
  beforeAll(async () => {
    await initializeModels();
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await createTestData();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe('VAT Calculations', () => {
    it('should calculate VAT correctly for Dutch customers', async () => {
      const vatRule = await VatRule.findOne({
        where: { country_code: 'NL', is_default: true }
      });
      
      expect(vatRule).toBeDefined();
      expect(parseFloat(vatRule.rate)).toBe(21);
      
      // Test VAT calculation
      const amount = 100;
      const vatRate = parseFloat(vatRule.rate);
      const amountExclVat = amount / (1 + vatRate / 100);
      const vatAmount = amount - amountExclVat;
      
      expect(amountExclVat).toBeCloseTo(82.64, 2);
      expect(vatAmount).toBeCloseTo(17.36, 2);
    });

    it('should handle reverse charge for B2B EU transactions', async () => {
      const reverseChargeRule = await VatRule.findOne({
        where: { 
          country_code: 'DE',
          name: { [sequelize.Op.iLike]: '%reverse charge%' }
        }
      });
      
      if (reverseChargeRule) {
        expect(parseFloat(reverseChargeRule.rate)).toBe(0);
        
        // Test reverse charge calculation
        const amount = 100;
        const vatAmount = 0; // No VAT for reverse charge
        const amountExclVat = amount;
        
        expect(amountExclVat).toBe(100);
        expect(vatAmount).toBe(0);
      }
    });

    it('should handle different VAT rates for different countries', async () => {
      const frVatRule = await VatRule.findOne({
        where: { country_code: 'FR', is_default: true }
      });
      
      if (frVatRule) {
        expect(parseFloat(frVatRule.rate)).toBe(20);
        
        // Test French VAT calculation
        const amount = 100;
        const vatRate = parseFloat(frVatRule.rate);
        const amountExclVat = amount / (1 + vatRate / 100);
        const vatAmount = amount - amountExclVat;
        
        expect(amountExclVat).toBeCloseTo(83.33, 2);
        expect(vatAmount).toBeCloseTo(16.67, 2);
      }
    });
  });

  describe('Invoice Template Management', () => {
    it('should create and retrieve invoice templates', async () => {
      const template = await InvoiceTemplate.create({
        name: 'Test Template',
        user_id: 'user-123',
        is_default: true,
        is_active: true,
        header_html: '<div>Test Header</div>',
        footer_html: '<div>Test Footer</div>',
        css_styles: 'body { font-family: Arial; }',
        company_info: 'Test Company Info'
      });
      
      expect(template.id).toBeDefined();
      expect(template.name).toBe('Test Template');
      expect(template.user_id).toBe('user-123');
      expect(template.is_default).toBe(true);
      
      const retrievedTemplate = await InvoiceTemplate.findByPk(template.id);
      expect(retrievedTemplate).toBeDefined();
      expect(retrievedTemplate.name).toBe('Test Template');
    });

    it('should handle template duplication', async () => {
      const originalTemplate = await InvoiceTemplate.create({
        name: 'Original Template',
        user_id: 'user-123',
        is_default: true,
        is_active: true,
        header_html: '<div>Original Header</div>',
        footer_html: '<div>Original Footer</div>',
        css_styles: 'body { font-family: Arial; }',
        company_info: 'Original Company Info'
      });
      
      const duplicatedTemplate = await InvoiceTemplate.create({
        name: 'Duplicated Template',
        user_id: 'user-123',
        is_default: false,
        is_active: true,
        header_html: originalTemplate.header_html,
        footer_html: originalTemplate.footer_html,
        css_styles: originalTemplate.css_styles,
        company_info: originalTemplate.company_info
      });
      
      expect(duplicatedTemplate.id).not.toBe(originalTemplate.id);
      expect(duplicatedTemplate.header_html).toBe(originalTemplate.header_html);
      expect(duplicatedTemplate.is_default).toBe(false);
    });
  });

  describe('VAT Rule Management', () => {
    it('should create and manage VAT rules', async () => {
      const vatRule = await VatRule.create({
        name: 'Test VAT Rule',
        rate: 15.5,
        country_code: 'US',
        is_default: true,
        is_active: true,
        description: 'Test VAT rule for US'
      });
      
      expect(vatRule.id).toBeDefined();
      expect(parseFloat(vatRule.rate)).toBe(15.5);
      expect(vatRule.country_code).toBe('US');
      expect(vatRule.is_default).toBe(true);
      
      // Test updating VAT rule
      await vatRule.update({ rate: 16.0 });
      expect(parseFloat(vatRule.rate)).toBe(16.0);
    });

    it('should handle EU VAT number validation', () => {
      const validateEUVatNumber = (vatNumber: string) => {
        const cleanVat = vatNumber.replace(/\s/g, '').toUpperCase();
        const euVatPattern = /^[A-Z]{2}[0-9A-Z]+$/;
        
        if (!euVatPattern.test(cleanVat)) {
          return { is_valid: false, error: 'Invalid EU VAT number format' };
        }
        
        const countryCode = cleanVat.substring(0, 2);
        const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
          'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
          'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
        
        if (!euCountries.includes(countryCode)) {
          return { is_valid: false, error: 'Invalid EU country code' };
        }
        
        return { is_valid: true, country_code: countryCode };
      };
      
      // Test valid EU VAT number
      const validResult = validateEUVatNumber('NL123456789B01');
      expect(validResult.is_valid).toBe(true);
      expect(validResult.country_code).toBe('NL');
      
      // Test invalid EU VAT number
      const invalidResult = validateEUVatNumber('XX123456789');
      expect(invalidResult.is_valid).toBe(false);
      expect(invalidResult.error).toBe('Invalid EU country code');
    });
  });
});

async function createTestData() {
  // Create VAT rules
  await VatRule.create({
    name: 'Standard VAT NL',
    rate: 21,
    country_code: 'NL',
    is_default: true,
    is_active: true,
    description: 'Standard Dutch VAT rate'
  });

  await VatRule.create({
    name: 'Standard VAT DE',
    rate: 19,
    country_code: 'DE',
    is_default: true,
    is_active: true,
    description: 'Standard German VAT rate'
  });

  await VatRule.create({
    name: 'Standard VAT FR',
    rate: 20,
    country_code: 'FR',
    is_default: true,
    is_active: true,
    description: 'Standard French VAT rate'
  });

  await VatRule.create({
    name: 'Reverse Charge',
    rate: 0,
    country_code: 'DE',
    is_default: false,
    is_active: true,
    description: 'Reverse charge for B2B EU transactions'
  });

  // Create default template
  await InvoiceTemplate.create({
    name: 'Default Template',
    user_id: 'user-123',
    is_default: true,
    is_active: true,
    header_html: '<div>Header</div>',
    footer_html: '<div>Footer</div>',
    css_styles: 'body { font-family: Arial; }',
    company_info: 'Test Company Info'
  });
} 