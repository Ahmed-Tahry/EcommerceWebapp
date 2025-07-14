import { Transaction } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, InvoiceItem, VatRule, InvoiceTemplate, InvoiceSettings, InvoiceAuditLog, BolInvoiceMapping } from '../models';
import { sequelize } from '../config/database';
import settingsService from './settingsService';
import shopService from './shopService';
import bolApiService from './bolApiService';

// Types for invoice generation
export interface InvoiceGenerationRequest {
  user_id: string;
  order_id: string;
  shipment_id?: string;
  template_id?: string;
  language?: 'nl' | 'fr' | 'en';
  notes?: string;
  customer_vat_number?: string;
}

export interface InvoiceGenerationResult {
  invoice: any; // InvoiceAttributes is removed, so use 'any' for now
  items: any[]; // InvoiceItemAttributes is removed, so use 'any' for now
  audit_log: any;
}

export interface VatCalculationResult {
  vat_rate: number;
  vat_amount: number;
  total_excl_vat: number;
  total_incl_vat: number;
}

export interface InvoiceNumberGenerationOptions {
  user_id: string;
  prefix?: string;
  sequence?: number;
}

export class InvoiceService {
  /**
   * Generate a VAT-compliant invoice for an order
   */
  async generateInvoice(
    request: InvoiceGenerationRequest,
    transaction?: Transaction
  ): Promise<InvoiceGenerationResult> {
    const t = transaction || await sequelize.transaction();
    
    try {
      // 1. Validate and fetch order data
      const order = await this.validateOrder(request.order_id, request.user_id);
      
      // 2. Get user settings and template
      const [settings, template] = await Promise.all([
        this.getUserSettings(request.user_id),
        this.getInvoiceTemplate(request.template_id, request.user_id)
      ]);
      
      // 3. Generate invoice number
      const invoiceNumber = await this.generateInvoiceNumber({
        user_id: request.user_id,
        prefix: settings.invoice_number_prefix
      });
      
      // 4. Calculate VAT and totals
      const vatCalculations = await this.calculateVatForOrder(order, request.customer_vat_number);
      
      // 5. Create invoice record
      const invoiceData: any = { // InvoiceCreationAttributes is removed, so use 'any' for now
        invoice_number: invoiceNumber,
        user_id: request.user_id,
        order_id: request.order_id,
        shipment_id: request.shipment_id,
        template_id: template.id,
        
        // Customer information from order
        customer_name: order.customer.name,
        customer_email: order.customer.email,
        customer_address: order.customer.address,
        customer_city: order.customer.city,
        customer_postal_code: order.customer.postal_code,
        customer_country: order.customer.country,
        customer_vat_number: request.customer_vat_number,
        
        // Seller information from settings
        seller_name: settings.seller_name,
        seller_address: settings.seller_address,
        seller_city: settings.seller_city,
        seller_postal_code: settings.seller_postal_code,
        seller_country: settings.seller_country,
        seller_vat_number: settings.seller_vat_number,
        seller_email: settings.seller_email,
        seller_phone: settings.seller_phone,
        
        // Invoice details
        invoice_date: new Date(),
        due_date: this.calculateDueDate(settings.payment_terms_days),
        currency: order.currency || 'EUR',
        subtotal: vatCalculations.subtotal,
        vat_total: vatCalculations.vat_total,
        total_amount: vatCalculations.total_amount,
        
        // Status and metadata
        status: 'draft',
        language: request.language || 'nl',
        notes: request.notes,
        
        // Bol.com integration
        bol_upload_status: 'pending',
        
        // Email distribution
        email_sent: false
      };
      
      const invoice = await Invoice.create(invoiceData, { transaction: t });
      
      // 6. Create invoice items
      const items = await this.createInvoiceItems(invoice.id, order.items, vatCalculations.itemCalculations, t);
      
      // 7. Create audit log
      const auditLog = await this.createAuditLog({
        invoice_id: invoice.id,
        user_id: request.user_id,
        action: 'invoice_generated',
        details: {
          order_id: request.order_id,
          shipment_id: request.shipment_id,
          template_id: template.id,
          vat_calculations: vatCalculations
        }
      }, t);
      
      // 8. Create Bol.com mapping if applicable
      if (order.bol_order_id) {
        await this.createBolMapping(invoice.id, order.bol_order_id, t);
      }
      
      if (!transaction) {
        await t.commit();
      }
      
      return {
        invoice: invoice.toJSON(),
        items: items.map(item => item.toJSON()),
        audit_log: auditLog.toJSON()
      };
      
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }
  
  /**
   * Validate order exists and belongs to user
   */
  private async validateOrder(order_id: string, user_id: string) {
    try {
      const order = await shopService.getOrder(order_id, user_id);
      if (!order) {
        throw new Error(`Order ${order_id} not found or access denied`);
      }
      return order;
    } catch (error) {
      throw new Error(`Failed to validate order: ${error.message}`);
    }
  }
  
  /**
   * Get user's invoice settings
   */
  private async getUserSettings(user_id: string) {
    try {
      const settings = await settingsService.getInvoiceSettings(user_id);
      if (!settings) {
        throw new Error('Invoice settings not found. Please complete onboarding first.');
      }
      return settings;
    } catch (error) {
      throw new Error(`Failed to get user settings: ${error.message}`);
    }
  }
  
  /**
   * Get invoice template
   */
  private async getInvoiceTemplate(template_id: string | undefined, user_id: string) {
    if (template_id) {
      const template = await InvoiceTemplate.findOne({
        where: { id: template_id, user_id }
      });
      if (!template) {
        throw new Error(`Template ${template_id} not found`);
      }
      return template;
    }
    
    // Get default template
    const defaultTemplate = await InvoiceTemplate.findOne({
      where: { user_id, is_default: true }
    });
    if (!defaultTemplate) {
      throw new Error('No default template found. Please create a template first.');
    }
    return defaultTemplate;
  }
  
  /**
   * Generate unique invoice number
   */
  async generateInvoiceNumber(options: InvoiceNumberGenerationOptions): Promise<string> {
    const { user_id, prefix = 'INV', sequence } = options;
    
    if (sequence) {
      return `${prefix}-${sequence.toString().padStart(6, '0')}`;
    }
    
    // Get the last invoice number for this user
    const lastInvoice = await Invoice.findOne({
      where: { user_id },
      order: [['invoice_number', 'DESC']]
    });
    
    let nextSequence = 1;
    if (lastInvoice) {
      const lastNumber = lastInvoice.invoice_number;
      const match = lastNumber.match(new RegExp(`^${prefix}-(\\d+)$`));
      if (match) {
        nextSequence = parseInt(match[1]) + 1;
      }
    }
    
    return `${prefix}-${nextSequence.toString().padStart(6, '0')}`;
  }
  
  /**
   * Calculate VAT for an entire order
   */
  async calculateVatForOrder(order: any, customer_vat_number?: string) {
    const itemCalculations = [];
    let subtotal = 0;
    let vat_total = 0;
    
    for (const item of order.items) {
      const calculation = await this.calculateVatForItem(item, customer_vat_number);
      itemCalculations.push(calculation);
      subtotal += calculation.total_excl_vat;
      vat_total += calculation.vat_amount;
    }
    
    return {
      subtotal,
      vat_total,
      total_amount: subtotal + vat_total,
      itemCalculations
    };
  }
  
  /**
   * Calculate VAT for a single item
   */
  async calculateVatForItem(item: any, customer_vat_number?: string): Promise<VatCalculationResult> {
    // Get VAT rule based on customer country and VAT number
    const vatRule = await this.getVatRule(item.customer_country, customer_vat_number);
    
    const quantity = item.quantity || 1;
    const unitPrice = parseFloat(item.unit_price) || 0;
    
    // Calculate VAT
    const vatRate = parseFloat(vatRule.rate);
    const unitPriceExclVat = unitPrice / (1 + vatRate / 100);
    const vatAmount = unitPrice - unitPriceExclVat;
    const lineTotalExclVat = unitPriceExclVat * quantity;
    const lineTotalInclVat = unitPrice * quantity;
    const lineVatAmount = vatAmount * quantity;
    
    return {
      vat_rate: vatRate,
      vat_amount: lineVatAmount,
      total_excl_vat: lineTotalExclVat,
      total_incl_vat: lineTotalInclVat
    };
  }
  
  /**
   * Get appropriate VAT rule for customer
   */
  private async getVatRule(customer_country: string, customer_vat_number?: string) {
    // If customer has VAT number and is in EU, apply reverse charge (0% VAT)
    if (customer_vat_number && this.isEUCountry(customer_country)) {
      const reverseChargeRule = await VatRule.findOne({
        where: { 
          country_code: customer_country,
          name: 'Reverse Charge'
        }
      });
      if (reverseChargeRule) {
        return reverseChargeRule;
      }
    }
    
    // Get standard VAT rule for country
    const vatRule = await VatRule.findOne({
      where: { 
        country_code: customer_country,
        is_active: true
      }
    });
    
    if (!vatRule) {
      // Fallback to default VAT rule
      const defaultRule = await VatRule.findOne({
        where: { is_default: true, is_active: true }
      });
      if (!defaultRule) {
        throw new Error('No VAT rule found for country and no default rule configured');
      }
      return defaultRule;
    }
    
    return vatRule;
  }
  
  /**
   * Check if country is in EU
   */
  private isEUCountry(country_code: string): boolean {
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
    ];
    return euCountries.includes(country_code.toUpperCase());
  }
  
  /**
   * Calculate due date based on payment terms
   */
  private calculateDueDate(paymentTermsDays: number): Date {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (paymentTermsDays || 30));
    return dueDate;
  }
  
  /**
   * Create invoice items
   */
  private async createInvoiceItems(
    invoice_id: string,
    orderItems: any[],
    vatCalculations: any[],
    transaction: Transaction
  ): Promise<InvoiceItem[]> {
    const items = [];
    
    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
      const calculation = vatCalculations[i];
      
      // Get VAT rule for this item
      const vatRule = await this.getVatRule(item.customer_country);
      
      const itemData: any = { // InvoiceItemCreationAttributes is removed, so use 'any' for now
        invoice_id,
        vat_rule_id: vatRule.id,
        
        // Product information
        ean: item.ean || '',
        product_name: item.product_name,
        product_description: item.product_description,
        sku: item.sku,
        
        // Pricing and quantities
        quantity: item.quantity || 1,
        unit_price: parseFloat(item.unit_price) || 0,
        unit_price_excl_vat: calculation.total_excl_vat / (item.quantity || 1),
        vat_rate: calculation.vat_rate,
        vat_amount: calculation.vat_amount,
        line_total: calculation.total_incl_vat,
        line_total_excl_vat: calculation.total_excl_vat,
        
        // Bol.com integration
        bol_order_item_id: item.bol_order_item_id,
        bol_offer_id: item.bol_offer_id,
        
        // Metadata
        notes: item.notes
      };
      
      const invoiceItem = await InvoiceItem.create(itemData, { transaction });
      items.push(invoiceItem);
    }
    
    return items;
  }
  
  /**
   * Create audit log entry
   */
  private async createAuditLog(
    data: {
      invoice_id: string;
      user_id: string;
      action: string;
      details: any;
    },
    transaction?: Transaction
  ) {
    return await InvoiceAuditLog.create({
      invoice_id: data.invoice_id,
      user_id: data.user_id,
      action: data.action,
      details: JSON.stringify(data.details),
      ip_address: 'system',
      user_agent: 'invoice-service'
    }, { transaction });
  }
  
  /**
   * Create Bol.com mapping
   */
  private async createBolMapping(
    invoice_id: string,
    bol_order_id: string,
    transaction: Transaction
  ) {
    return await BolInvoiceMapping.create({
      invoice_id,
      bol_order_id,
      mapping_type: 'order_to_invoice',
      status: 'pending'
    }, { transaction });
  }
  
  /**
   * Get invoice by ID with items and template
   */
  async getInvoice(invoice_id: string, user_id: string) {
    const invoice = await Invoice.findOne({
      where: { id: invoice_id, user_id },
      include: [
        {
          model: InvoiceItem,
          as: 'items',
          include: [{ model: VatRule, as: 'vatRule' }]
        },
        {
          model: InvoiceTemplate,
          as: 'template'
        },
        {
          model: InvoiceAuditLog,
          as: 'auditLogs',
          order: [['created_at', 'DESC']],
          limit: 10
        }
      ]
    });
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    return invoice;
  }
  
  /**
   * Update invoice status
   */
  async updateInvoiceStatus(
    invoice_id: string,
    user_id: string,
    status: 'draft' | 'generated' | 'sent' | 'paid' | 'cancelled',
    notes?: string
  ) {
    const invoice = await Invoice.findOne({
      where: { id: invoice_id, user_id }
    });
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    await invoice.update({ status, notes });
    
    // Create audit log
    await this.createAuditLog({
      invoice_id,
      user_id,
      action: `status_updated_to_${status}`,
      details: { previous_status: invoice.status, new_status: status, notes }
    });
    
    return invoice;
  }
  
  /**
   * Get invoices for user with pagination
   */
  async getUserInvoices(
    user_id: string,
    page: number = 1,
    limit: number = 20,
    status?: string
  ) {
    const offset = (page - 1) * limit;
    const where: any = { user_id };
    
    if (status) {
      where.status = status;
    }
    
    const { count, rows } = await Invoice.findAndCountAll({
      where,
      include: [
        {
          model: InvoiceItem,
          as: 'items',
          attributes: ['id', 'product_name', 'quantity', 'line_total']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });
    
    return {
      invoices: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }
  
  /**
   * Delete invoice (soft delete by setting status to cancelled)
   */
  async deleteInvoice(invoice_id: string, user_id: string) {
    return await this.updateInvoiceStatus(invoice_id, user_id, 'cancelled', 'Invoice deleted by user');
  }
}

export default new InvoiceService(); 