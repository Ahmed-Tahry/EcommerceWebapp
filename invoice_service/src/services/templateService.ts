import { Transaction } from 'sequelize';
import { InvoiceTemplate } from '../models';
import { sequelize } from '../config/database';

// Types for template operations
export interface TemplateRequest {
  name: string;
  user_id: string;
  template_type: 'default' | 'custom';
  language: 'nl' | 'fr' | 'en';
  is_default?: boolean;
  
  // Template content
  header_html?: string;
  footer_html?: string;
  css_styles?: string;
  
  // Business information
  company_logo_url?: string;
  company_name?: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  company_website?: string;
  
  // Invoice settings
  show_vat_breakdown?: boolean;
  show_payment_terms?: boolean;
  show_due_date?: boolean;
  currency_symbol?: string;
  currency_position?: 'before' | 'after';
  
  // Metadata
  description?: string;
  is_active?: boolean;
}

export interface TemplatePreviewRequest {
  template_id: string;
  user_id: string;
  sample_data?: any;
}

export interface TemplatePreviewResponse {
  html: string;
  css: string;
  metadata: any;
}

export class TemplateService {
  /**
   * Create a new invoice template
   */
  async createTemplate(data: TemplateRequest, transaction?: Transaction): Promise<InvoiceTemplate> {
    const t = transaction || await sequelize.transaction();
    
    try {
      // If this is a default template, unset other default templates for the user
      if (data.is_default) {
        await InvoiceTemplate.update(
          { is_default: false },
          { 
            where: { user_id: data.user_id },
            transaction: t 
          }
        );
      }
      
      const template = await InvoiceTemplate.create({
        name: data.name,
        user_id: data.user_id,
        template_type: data.template_type,
        language: data.language,
        is_default: data.is_default || false,
        
        // Template content
        header_html: data.header_html || this.getDefaultHeader(data.language),
        footer_html: data.footer_html || this.getDefaultFooter(data.language),
        css_styles: data.css_styles || this.getDefaultCSS(),
        
        // Business information
        company_logo_url: data.company_logo_url,
        company_name: data.company_name,
        company_address: data.company_address,
        company_phone: data.company_phone,
        company_email: data.company_email,
        company_website: data.company_website,
        
        // Invoice settings
        show_vat_breakdown: data.show_vat_breakdown !== false,
        show_payment_terms: data.show_payment_terms !== false,
        show_due_date: data.show_due_date !== false,
        currency_symbol: data.currency_symbol || '€',
        currency_position: data.currency_position || 'after',
        
        // Metadata
        description: data.description,
        is_active: data.is_active !== false
      }, { transaction: t });
      
      if (!transaction) {
        await t.commit();
      }
      
      return template;
      
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }
  
  /**
   * Update an existing template
   */
  async updateTemplate(
    id: string,
    user_id: string,
    data: Partial<TemplateRequest>,
    transaction?: Transaction
  ): Promise<InvoiceTemplate> {
    const t = transaction || await sequelize.transaction();
    
    try {
      const template = await InvoiceTemplate.findOne({
        where: { id, user_id }
      });
      
      if (!template) {
        throw new Error('Template not found');
      }
      
      // If setting as default, unset other default templates
      if (data.is_default) {
        await InvoiceTemplate.update(
          { is_default: false },
          { 
            where: { 
              user_id,
              id: { [sequelize.Op.ne]: id }
            },
            transaction: t 
          }
        );
      }
      
      await template.update(data, { transaction: t });
      
      if (!transaction) {
        await t.commit();
      }
      
      return template;
      
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }
  
  /**
   * Delete a template
   */
  async deleteTemplate(id: string, user_id: string, transaction?: Transaction): Promise<void> {
    const t = transaction || await sequelize.transaction();
    
    try {
      const template = await InvoiceTemplate.findOne({
        where: { id, user_id }
      });
      
      if (!template) {
        throw new Error('Template not found');
      }
      
      // Don't allow deletion of the only template
      const count = await InvoiceTemplate.count({
        where: { user_id, is_active: true }
      });
      
      if (count === 1) {
        throw new Error('Cannot delete the only active template');
      }
      
      await template.destroy({ transaction: t });
      
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
   * Get template by ID
   */
  async getTemplate(id: string, user_id: string): Promise<InvoiceTemplate | null> {
    return await InvoiceTemplate.findOne({
      where: { id, user_id }
    });
  }
  
  /**
   * Get all templates for a user
   */
  async getUserTemplates(user_id: string): Promise<InvoiceTemplate[]> {
    return await InvoiceTemplate.findAll({
      where: { user_id, is_active: true },
      order: [['is_default', 'DESC'], ['name', 'ASC']]
    });
  }
  
  /**
   * Get default template for a user
   */
  async getDefaultTemplate(user_id: string): Promise<InvoiceTemplate | null> {
    return await InvoiceTemplate.findOne({
      where: { 
        user_id,
        is_default: true,
        is_active: true
      }
    });
  }
  
  /**
   * Duplicate a template
   */
  async duplicateTemplate(
    id: string,
    user_id: string,
    new_name: string,
    transaction?: Transaction
  ): Promise<InvoiceTemplate> {
    const t = transaction || await sequelize.transaction();
    
    try {
      const originalTemplate = await InvoiceTemplate.findOne({
        where: { id, user_id }
      });
      
      if (!originalTemplate) {
        throw new Error('Template not found');
      }
      
      const duplicatedTemplate = await InvoiceTemplate.create({
        name: new_name,
        user_id,
        template_type: 'custom',
        language: originalTemplate.language,
        is_default: false,
        
        // Copy all content
        header_html: originalTemplate.header_html,
        footer_html: originalTemplate.footer_html,
        css_styles: originalTemplate.css_styles,
        
        // Copy business information
        company_logo_url: originalTemplate.company_logo_url,
        company_name: originalTemplate.company_name,
        company_address: originalTemplate.company_address,
        company_phone: originalTemplate.company_phone,
        company_email: originalTemplate.company_email,
        company_website: originalTemplate.company_website,
        
        // Copy invoice settings
        show_vat_breakdown: originalTemplate.show_vat_breakdown,
        show_payment_terms: originalTemplate.show_payment_terms,
        show_due_date: originalTemplate.show_due_date,
        currency_symbol: originalTemplate.currency_symbol,
        currency_position: originalTemplate.currency_position,
        
        // Metadata
        description: `Copy of ${originalTemplate.name}`,
        is_active: true
      }, { transaction: t });
      
      if (!transaction) {
        await t.commit();
      }
      
      return duplicatedTemplate;
      
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }
  
  /**
   * Generate template preview
   */
  async generatePreview(request: TemplatePreviewRequest): Promise<TemplatePreviewResponse> {
    const template = await InvoiceTemplate.findOne({
      where: { id: request.template_id, user_id: request.user_id }
    });
    
    if (!template) {
      throw new Error('Template not found');
    }
    
    const sampleData = request.sample_data || this.getSampleData(template.language);
    
    const html = this.renderTemplate(template, sampleData);
    const css = template.css_styles || this.getDefaultCSS();
    
    return {
      html,
      css,
      metadata: {
        template_name: template.name,
        language: template.language,
        currency_symbol: template.currency_symbol,
        currency_position: template.currency_position
      }
    };
  }
  
  /**
   * Render template with data
   */
  private renderTemplate(template: InvoiceTemplate, data: any): string {
    let html = template.header_html || '';
    
    // Add invoice content
    html += this.renderInvoiceContent(template, data);
    
    // Add footer
    html += template.footer_html || '';
    
    return html;
  }
  
  /**
   * Render invoice content
   */
  private renderInvoiceContent(template: InvoiceTemplate, data: any): string {
    let content = '<div class="invoice-content">';
    
    // Invoice header
    content += `<div class="invoice-header">
      <h1>${this.getText('invoice', template.language)} ${data.invoice_number}</h1>
      <div class="invoice-dates">
        <p><strong>${this.getText('date', template.language)}:</strong> ${data.invoice_date}</p>
        ${template.show_due_date ? `<p><strong>${this.getText('due_date', template.language)}:</strong> ${data.due_date}</p>` : ''}
      </div>
    </div>`;
    
    // Customer and seller info
    content += `<div class="invoice-parties">
      <div class="customer-info">
        <h3>${this.getText('bill_to', template.language)}</h3>
        <p>${data.customer_name}</p>
        <p>${data.customer_address}</p>
        <p>${data.customer_city}, ${data.customer_postal_code}</p>
        <p>${data.customer_country}</p>
        ${data.customer_vat_number ? `<p>${this.getText('vat_number', template.language)}: ${data.customer_vat_number}</p>` : ''}
      </div>
      <div class="seller-info">
        <h3>${this.getText('from', template.language)}</h3>
        <p>${template.company_name || data.seller_name}</p>
        <p>${template.company_address || data.seller_address}</p>
        <p>${template.company_phone || data.seller_phone}</p>
        <p>${template.company_email || data.seller_email}</p>
        ${template.company_website ? `<p>${template.company_website}</p>` : ''}
      </div>
    </div>`;
    
    // Items table
    content += `<div class="invoice-items">
      <table>
        <thead>
          <tr>
            <th>${this.getText('item', template.language)}</th>
            <th>${this.getText('quantity', template.language)}</th>
            <th>${this.getText('unit_price', template.language)}</th>
            ${template.show_vat_breakdown ? `<th>${this.getText('vat_rate', template.language)}</th>` : ''}
            <th>${this.getText('total', template.language)}</th>
          </tr>
        </thead>
        <tbody>`;
    
    data.items.forEach((item: any) => {
      content += `<tr>
        <td>${item.product_name}</td>
        <td>${item.quantity}</td>
        <td>${this.formatCurrency(item.unit_price, template)}</td>
        ${template.show_vat_breakdown ? `<td>${item.vat_rate}%</td>` : ''}
        <td>${this.formatCurrency(item.line_total, template)}</td>
      </tr>`;
    });
    
    content += '</tbody></table></div>';
    
    // Totals
    content += `<div class="invoice-totals">
      <div class="subtotal">
        <span>${this.getText('subtotal', template.language)}:</span>
        <span>${this.formatCurrency(data.subtotal, template)}</span>
      </div>
      ${template.show_vat_breakdown ? `<div class="vat-total">
        <span>${this.getText('vat_total', template.language)}:</span>
        <span>${this.formatCurrency(data.vat_total, template)}</span>
      </div>` : ''}
      <div class="total">
        <span>${this.getText('total', template.language)}:</span>
        <span>${this.formatCurrency(data.total_amount, template)}</span>
      </div>
    </div>`;
    
    // Payment terms
    if (template.show_payment_terms && data.payment_terms) {
      content += `<div class="payment-terms">
        <h4>${this.getText('payment_terms', template.language)}</h4>
        <p>${data.payment_terms}</p>
      </div>`;
    }
    
    content += '</div>';
    return content;
  }
  
  /**
   * Format currency based on template settings
   */
  private formatCurrency(amount: number, template: InvoiceTemplate): string {
    const formatted = amount.toFixed(2);
    if (template.currency_position === 'before') {
      return `${template.currency_symbol}${formatted}`;
    } else {
      return `${formatted}${template.currency_symbol}`;
    }
  }
  
  /**
   * Get localized text
   */
  private getText(key: string, language: string): string {
    const translations = {
      nl: {
        invoice: 'Factuur',
        date: 'Datum',
        due_date: 'Vervaldatum',
        bill_to: 'Factuur naar',
        from: 'Van',
        vat_number: 'BTW-nummer',
        item: 'Artikel',
        quantity: 'Aantal',
        unit_price: 'Prijs per stuk',
        vat_rate: 'BTW-tarief',
        total: 'Totaal',
        subtotal: 'Subtotaal',
        vat_total: 'BTW-totaal',
        payment_terms: 'Betalingsvoorwaarden'
      },
      fr: {
        invoice: 'Facture',
        date: 'Date',
        due_date: 'Date d\'échéance',
        bill_to: 'Facturer à',
        from: 'De',
        vat_number: 'Numéro de TVA',
        item: 'Article',
        quantity: 'Quantité',
        unit_price: 'Prix unitaire',
        vat_rate: 'Taux de TVA',
        total: 'Total',
        subtotal: 'Sous-total',
        vat_total: 'Total TVA',
        payment_terms: 'Conditions de paiement'
      },
      en: {
        invoice: 'Invoice',
        date: 'Date',
        due_date: 'Due Date',
        bill_to: 'Bill To',
        from: 'From',
        vat_number: 'VAT Number',
        item: 'Item',
        quantity: 'Quantity',
        unit_price: 'Unit Price',
        vat_rate: 'VAT Rate',
        total: 'Total',
        subtotal: 'Subtotal',
        vat_total: 'VAT Total',
        payment_terms: 'Payment Terms'
      }
    };
    
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.nl] || key;
  }
  
  /**
   * Get sample data for preview
   */
  private getSampleData(language: string): any {
    return {
      invoice_number: 'INV-000001',
      invoice_date: new Date().toLocaleDateString(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      customer_name: 'John Doe',
      customer_address: '123 Main Street',
      customer_city: 'Amsterdam',
      customer_postal_code: '1000 AA',
      customer_country: 'NL',
      customer_vat_number: 'NL123456789B01',
      seller_name: 'Your Company',
      seller_address: '456 Business Ave',
      seller_phone: '+31 20 123 4567',
      seller_email: 'info@yourcompany.com',
      items: [
        {
          product_name: 'Sample Product 1',
          quantity: 2,
          unit_price: 25.00,
          vat_rate: 21,
          line_total: 50.00
        },
        {
          product_name: 'Sample Product 2',
          quantity: 1,
          unit_price: 75.00,
          vat_rate: 21,
          line_total: 75.00
        }
      ],
      subtotal: 103.31,
      vat_total: 21.69,
      total_amount: 125.00,
      payment_terms: 'Payment within 30 days'
    };
  }
  
  /**
   * Get default header HTML
   */
  private getDefaultHeader(language: string): string {
    return `<div class="invoice-header">
      <div class="logo">
        <img src="/logo.png" alt="Company Logo" />
      </div>
      <div class="company-info">
        <h2>Your Company Name</h2>
        <p>Your Company Address</p>
        <p>Phone: +31 20 123 4567</p>
        <p>Email: info@yourcompany.com</p>
      </div>
    </div>`;
  }
  
  /**
   * Get default footer HTML
   */
  private getDefaultFooter(language: string): string {
    return `<div class="invoice-footer">
      <p>Thank you for your business!</p>
      <p>For questions, please contact us at info@yourcompany.com</p>
    </div>`;
  }
  
  /**
   * Get default CSS styles
   */
  private getDefaultCSS(): string {
    return `
      .invoice-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #333;
      }
      
      .invoice-parties {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
      }
      
      .customer-info, .seller-info {
        flex: 1;
        margin: 0 15px;
      }
      
      .invoice-items table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
      }
      
      .invoice-items th,
      .invoice-items td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      
      .invoice-items th {
        background-color: #f5f5f5;
        font-weight: bold;
      }
      
      .invoice-totals {
        text-align: right;
        margin-bottom: 30px;
      }
      
      .invoice-totals > div {
        margin: 5px 0;
      }
      
      .total {
        font-size: 1.2em;
        font-weight: bold;
        border-top: 2px solid #333;
        padding-top: 10px;
      }
      
      .payment-terms {
        margin-top: 30px;
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 5px;
      }
      
      .invoice-footer {
        margin-top: 50px;
        text-align: center;
        color: #666;
        font-size: 0.9em;
      }
    `;
  }
}

export default new TemplateService(); 