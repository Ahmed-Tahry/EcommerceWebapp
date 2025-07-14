import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { sequelize } from '../config/database';
import { initializeModels } from '../models';

let invoiceService, vatService, templateService, settingsService, shopService;
let Invoice, InvoiceItem, VatRule, InvoiceTemplate, InvoiceSettings;

// Mock external services (will be set after import)

beforeAll(async () => {
  await initializeModels();
  // Dynamically import services and models after models are initialized
  invoiceService = (await import('../services/invoiceService')).default;
  vatService = (await import('../services/vatService')).default;
  templateService = (await import('../services/templateService')).default;
  settingsService = (await import('../services/settingsService')).default;
  shopService = (await import('../services/shopService')).default;
  Invoice = (await import('../models/Invoice')).default;
  InvoiceItem = (await import('../models/InvoiceItem')).default;
  VatRule = (await import('../models/VatRule')).default;
  InvoiceTemplate = (await import('../models/InvoiceTemplate')).default;
  InvoiceSettings = (await import('../models/InvoiceSettings')).default;
  // Mock after import
  vi.mock('../services/settingsService');
  vi.mock('../services/shopService');
});

describe('InvoiceService', () => {
  beforeEach(async () => {
    // Sync database
    await sequelize.sync({ force: true });
    
    // Create test data
    await createTestData();
  });

  afterEach(async () => {
    // Clean up
    await sequelize.close();
  });

  describe('generateInvoice', () => {
    it('should generate a complete invoice with VAT calculations', async () => {
      // Mock external service responses
      const mockOrder = {
        id: 'order-123',
        bol_order_id: 'bol-123',
        currency: 'EUR',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          address: '123 Main St',
          city: 'Amsterdam',
          postal_code: '1000 AA',
          country: 'NL'
        },
        items: [
          {
            ean: '1234567890123',
            product_name: 'Test Product 1',
            quantity: 2,
            unit_price: 25.00,
            customer_country: 'NL',
            bol_order_item_id: 'bol-item-1'
          },
          {
            ean: '9876543210987',
            product_name: 'Test Product 2',
            quantity: 1,
            unit_price: 50.00,
            customer_country: 'NL',
            bol_order_item_id: 'bol-item-2'
          }
        ]
      };

      const mockSettings = {
        seller_name: 'Test Company',
        seller_address: '456 Business Ave',
        seller_city: 'Rotterdam',
        seller_postal_code: '3000 BB',
        seller_country: 'NL',
        seller_vat_number: 'NL123456789B01',
        seller_email: 'info@testcompany.com',
        seller_phone: '+31 10 123 4567',
        invoice_number_prefix: 'TEST',
        payment_terms_days: 30
      };

      (shopService.getOrder as any).mockResolvedValue(mockOrder);
      (settingsService.getUserInvoiceSettings as any).mockResolvedValue(mockSettings);

      const request = {
        user_id: 'user-123',
        order_id: 'order-123',
        language: 'nl' as const,
        notes: 'Test invoice'
      };

      const result = await invoiceService.generateInvoice(request);

      expect(result.invoice).toBeDefined();
      expect(result.invoice.invoice_number).toMatch(/^TEST-\d{6}$/);
      expect(result.invoice.user_id).toBe('user-123');
      expect(result.invoice.order_id).toBe('order-123');
      expect(result.invoice.status).toBe('draft');
      expect(result.invoice.language).toBe('nl');
      expect(result.invoice.notes).toBe('Test invoice');

      // Check customer information
      expect(result.invoice.customer_name).toBe('John Doe');
      expect(result.invoice.customer_email).toBe('john@example.com');
      expect(result.invoice.customer_country).toBe('NL');

      // Check seller information
      expect(result.invoice.seller_name).toBe('Test Company');
      expect(result.invoice.seller_vat_number).toBe('NL123456789B01');

      // Check totals (21% VAT for Netherlands)
      expect(result.invoice.subtotal).toBeCloseTo(82.64, 2); // (50 + 50) / 1.21
      expect(result.invoice.vat_total).toBeCloseTo(17.36, 2); // 100 - 82.64
      expect(result.invoice.total_amount).toBe(100.00);

      // Check items
      expect(result.items).toHaveLength(2);
      expect(result.items[0].product_name).toBe('Test Product 1');
      expect(result.items[0].quantity).toBe(2);
      expect(result.items[0].vat_rate).toBe(21);
      expect(result.items[1].product_name).toBe('Test Product 2');
      expect(result.items[1].quantity).toBe(1);
      expect(result.items[1].vat_rate).toBe(21);

      // Check audit log
      expect(result.audit_log).toBeDefined();
      expect(result.audit_log.action).toBe('invoice_generated');
    });

    it('should handle EU B2B transactions with reverse charge', async () => {
      const mockOrder = {
        id: 'order-456',
        currency: 'EUR',
        customer: {
          name: 'Business Customer',
          email: 'business@example.com',
          address: '789 Business St',
          city: 'Berlin',
          postal_code: '10115',
          country: 'DE'
        },
        items: [
          {
            ean: '1234567890123',
            product_name: 'B2B Product',
            quantity: 1,
            unit_price: 100.00,
            customer_country: 'DE'
          }
        ]
      };

      const mockSettings = {
        seller_name: 'Test Company',
        seller_address: '456 Business Ave',
        seller_city: 'Rotterdam',
        seller_postal_code: '3000 BB',
        seller_country: 'NL',
        seller_vat_number: 'NL123456789B01',
        seller_email: 'info@testcompany.com',
        payment_terms_days: 30
      };

      (shopService.getOrder as any).mockResolvedValue(mockOrder);
      (settingsService.getUserInvoiceSettings as any).mockResolvedValue(mockSettings);

      const request = {
        user_id: 'user-123',
        order_id: 'order-456',
        customer_vat_number: 'DE123456789'
      };

      const result = await invoiceService.generateInvoice(request);

      // For B2B EU transactions with VAT number, should apply reverse charge (0% VAT)
      expect(result.invoice.vat_total).toBe(0);
      expect(result.invoice.subtotal).toBe(100.00);
      expect(result.invoice.total_amount).toBe(100.00);
      expect(result.invoice.customer_vat_number).toBe('DE123456789');
    });

    it('should handle different VAT rates for different countries', async () => {
      const mockOrder = {
        id: 'order-789',
        currency: 'EUR',
        customer: {
          name: 'French Customer',
          email: 'french@example.com',
          address: '123 Rue de Paris',
          city: 'Paris',
          postal_code: '75001',
          country: 'FR'
        },
        items: [
          {
            ean: '1234567890123',
            product_name: 'French Product',
            quantity: 1,
            unit_price: 100.00,
            customer_country: 'FR'
          }
        ]
      };

      const mockSettings = {
        seller_name: 'Test Company',
        seller_address: '456 Business Ave',
        seller_city: 'Rotterdam',
        seller_postal_code: '3000 BB',
        seller_country: 'NL',
        seller_vat_number: 'NL123456789B01',
        seller_email: 'info@testcompany.com',
        payment_terms_days: 30
      };

      (shopService.getOrder as any).mockResolvedValue(mockOrder);
      (settingsService.getUserInvoiceSettings as any).mockResolvedValue(mockSettings);

      const request = {
        user_id: 'user-123',
        order_id: 'order-789'
      };

      const result = await invoiceService.generateInvoice(request);

      // France has 20% VAT
      expect(result.invoice.vat_total).toBeCloseTo(16.67, 2); // 100 - (100/1.20)
      expect(result.invoice.subtotal).toBeCloseTo(83.33, 2); // 100/1.20
      expect(result.invoice.total_amount).toBe(100.00);
    });

    it('should throw error for non-existent order', async () => {
      (shopService.getOrder as any).mockResolvedValue(null);

      const request = {
        user_id: 'user-123',
        order_id: 'non-existent'
      };

      await expect(invoiceService.generateInvoice(request)).rejects.toThrow(
        'Order non-existent not found or access denied'
      );
    });

    it('should throw error for missing user settings', async () => {
      const mockOrder = {
        id: 'order-123',
        customer: { name: 'Test', email: 'test@example.com', address: 'Test', city: 'Test', postal_code: 'Test', country: 'NL' },
        items: []
      };

      (shopService.getOrder as any).mockResolvedValue(mockOrder);
      (settingsService.getUserInvoiceSettings as any).mockResolvedValue(null);

      const request = {
        user_id: 'user-123',
        order_id: 'order-123'
      };

      await expect(invoiceService.generateInvoice(request)).rejects.toThrow(
        'Invoice settings not found. Please complete onboarding first.'
      );
    });
  });

  describe('generateInvoiceNumber', () => {
    it('should generate sequential invoice numbers', async () => {
      const options = { user_id: 'user-123', prefix: 'TEST' };
      
      const number1 = await invoiceService.generateInvoiceNumber(options);
      const number2 = await invoiceService.generateInvoiceNumber(options);
      const number3 = await invoiceService.generateInvoiceNumber(options);

      expect(number1).toBe('TEST-000001');
      expect(number2).toBe('TEST-000002');
      expect(number3).toBe('TEST-000003');
    });

    it('should handle custom sequence', async () => {
      const options = { user_id: 'user-123', prefix: 'CUST', sequence: 100 };
      
      const number = await invoiceService.generateInvoiceNumber(options);
      expect(number).toBe('CUST-000100');
    });

    it('should handle different users independently', async () => {
      const user1Options = { user_id: 'user-1', prefix: 'U1' };
      const user2Options = { user_id: 'user-2', prefix: 'U2' };
      
      const user1Number1 = await invoiceService.generateInvoiceNumber(user1Options);
      const user2Number1 = await invoiceService.generateInvoiceNumber(user2Options);
      const user1Number2 = await invoiceService.generateInvoiceNumber(user1Options);

      expect(user1Number1).toBe('U1-000001');
      expect(user2Number1).toBe('U2-000001');
      expect(user1Number2).toBe('U1-000002');
    });
  });

  describe('getInvoice', () => {
    it('should return invoice with items and template', async () => {
      // Create test invoice
      const invoice = await Invoice.create({
        invoice_number: 'TEST-001',
        user_id: 'user-123',
        order_id: 'order-123',
        template_id: 'template-123',
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_address: 'Test Address',
        customer_city: 'Test City',
        customer_postal_code: '1234 AB',
        customer_country: 'NL',
        seller_name: 'Test Seller',
        seller_address: 'Seller Address',
        seller_city: 'Seller City',
        seller_postal_code: '5678 CD',
        seller_country: 'NL',
        seller_vat_number: 'NL123456789B01',
        seller_email: 'seller@example.com',
        invoice_date: new Date(),
        due_date: new Date(),
        currency: 'EUR',
        subtotal: 100,
        vat_total: 21,
        total_amount: 121,
        status: 'draft',
        language: 'nl',
        bol_upload_status: 'pending',
        email_sent: false
      });

      const result = await invoiceService.getInvoice(invoice.id, 'user-123');
      
      expect(result).toBeDefined();
      expect(result.id).toBe(invoice.id);
      expect(result.invoice_number).toBe('TEST-001');
    });

    it('should throw error for non-existent invoice', async () => {
      await expect(invoiceService.getInvoice('non-existent', 'user-123')).rejects.toThrow(
        'Invoice not found'
      );
    });

    it('should throw error for invoice belonging to different user', async () => {
      const invoice = await Invoice.create({
        invoice_number: 'TEST-002',
        user_id: 'user-123',
        order_id: 'order-123',
        template_id: 'template-123',
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_address: 'Test Address',
        customer_city: 'Test City',
        customer_postal_code: '1234 AB',
        customer_country: 'NL',
        seller_name: 'Test Seller',
        seller_address: 'Seller Address',
        seller_city: 'Seller City',
        seller_postal_code: '5678 CD',
        seller_country: 'NL',
        seller_vat_number: 'NL123456789B01',
        seller_email: 'seller@example.com',
        invoice_date: new Date(),
        due_date: new Date(),
        currency: 'EUR',
        subtotal: 100,
        vat_total: 21,
        total_amount: 121,
        status: 'draft',
        language: 'nl',
        bol_upload_status: 'pending',
        email_sent: false
      });

      await expect(invoiceService.getInvoice(invoice.id, 'different-user')).rejects.toThrow(
        'Invoice not found'
      );
    });
  });

  describe('updateInvoiceStatus', () => {
    it('should update invoice status and create audit log', async () => {
      const invoice = await Invoice.create({
        invoice_number: 'TEST-003',
        user_id: 'user-123',
        order_id: 'order-123',
        template_id: 'template-123',
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_address: 'Test Address',
        customer_city: 'Test City',
        customer_postal_code: '1234 AB',
        customer_country: 'NL',
        seller_name: 'Test Seller',
        seller_address: 'Seller Address',
        seller_city: 'Seller City',
        seller_postal_code: '5678 CD',
        seller_country: 'NL',
        seller_vat_number: 'NL123456789B01',
        seller_email: 'seller@example.com',
        invoice_date: new Date(),
        due_date: new Date(),
        currency: 'EUR',
        subtotal: 100,
        vat_total: 21,
        total_amount: 121,
        status: 'draft',
        language: 'nl',
        bol_upload_status: 'pending',
        email_sent: false
      });

      const updatedInvoice = await invoiceService.updateInvoiceStatus(
        invoice.id,
        'user-123',
        'sent',
        'Invoice sent to customer'
      );

      expect(updatedInvoice.status).toBe('sent');
      expect(updatedInvoice.notes).toBe('Invoice sent to customer');
    });
  });

  describe('getUserInvoices', () => {
    it('should return paginated invoices for user', async () => {
      // Create multiple test invoices
      for (let i = 1; i <= 5; i++) {
        await Invoice.create({
          invoice_number: `TEST-00${i}`,
          user_id: 'user-123',
          order_id: `order-${i}`,
          template_id: 'template-123',
          customer_name: 'Test Customer',
          customer_email: 'test@example.com',
          customer_address: 'Test Address',
          customer_city: 'Test City',
          customer_postal_code: '1234 AB',
          customer_country: 'NL',
          seller_name: 'Test Seller',
          seller_address: 'Seller Address',
          seller_city: 'Seller City',
          seller_postal_code: '5678 CD',
          seller_country: 'NL',
          seller_vat_number: 'NL123456789B01',
          seller_email: 'seller@example.com',
          invoice_date: new Date(),
          due_date: new Date(),
          currency: 'EUR',
          subtotal: 100,
          vat_total: 21,
          total_amount: 121,
          status: 'draft',
          language: 'nl',
          bol_upload_status: 'pending',
          email_sent: false
        });
      }

      const result = await invoiceService.getUserInvoices('user-123', 1, 3);

      expect(result.invoices).toHaveLength(3);
      expect(result.pagination.total).toBe(5);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(3);
      expect(result.pagination.totalPages).toBe(2);
    });

    it('should filter by status', async () => {
      // Create invoices with different statuses
      await Invoice.create({
        invoice_number: 'TEST-001',
        user_id: 'user-123',
        order_id: 'order-1',
        template_id: 'template-123',
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_address: 'Test Address',
        customer_city: 'Test City',
        customer_postal_code: '1234 AB',
        customer_country: 'NL',
        seller_name: 'Test Seller',
        seller_address: 'Seller Address',
        seller_city: 'Seller City',
        seller_postal_code: '5678 CD',
        seller_country: 'NL',
        seller_vat_number: 'NL123456789B01',
        seller_email: 'seller@example.com',
        invoice_date: new Date(),
        due_date: new Date(),
        currency: 'EUR',
        subtotal: 100,
        vat_total: 21,
        total_amount: 121,
        status: 'draft',
        language: 'nl',
        bol_upload_status: 'pending',
        email_sent: false
      });

      await Invoice.create({
        invoice_number: 'TEST-002',
        user_id: 'user-123',
        order_id: 'order-2',
        template_id: 'template-123',
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        customer_address: 'Test Address',
        customer_city: 'Test City',
        customer_postal_code: '1234 AB',
        customer_country: 'NL',
        seller_name: 'Test Seller',
        seller_address: 'Seller Address',
        seller_city: 'Seller City',
        seller_postal_code: '5678 CD',
        seller_country: 'NL',
        seller_vat_number: 'NL123456789B01',
        seller_email: 'seller@example.com',
        invoice_date: new Date(),
        due_date: new Date(),
        currency: 'EUR',
        subtotal: 100,
        vat_total: 21,
        total_amount: 121,
        status: 'sent',
        language: 'nl',
        bol_upload_status: 'pending',
        email_sent: false
      });

      const result = await invoiceService.getUserInvoices('user-123', 1, 10, 'draft');

      expect(result.invoices).toHaveLength(1);
      expect(result.invoices[0].status).toBe('draft');
    });
  });
});

// Helper function to create test data
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