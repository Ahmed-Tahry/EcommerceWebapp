import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
  HasMany,
  BelongsTo,
  HasOne
} from 'sequelize';
import { sequelize } from '@/config/database';

// Interface for Invoice attributes
export interface InvoiceAttributes {
  id: string;
  invoice_number: string;
  user_id: string;
  order_id: string;
  shipment_id?: string;
  template_id: string;
  
  // Customer information
  customer_name: string;
  customer_email: string;
  customer_address: string;
  customer_city: string;
  customer_postal_code: string;
  customer_country: string;
  customer_vat_number?: string;
  
  // Seller information
  seller_name: string;
  seller_address: string;
  seller_city: string;
  seller_postal_code: string;
  seller_country: string;
  seller_vat_number: string;
  seller_email: string;
  seller_phone?: string;
  
  // Invoice details
  invoice_date: Date;
  due_date: Date;
  currency: string;
  subtotal: number;
  vat_total: number;
  total_amount: number;
  
  // Status and metadata
  status: 'draft' | 'generated' | 'sent' | 'paid' | 'cancelled';
  language: 'nl' | 'fr' | 'en';
  notes?: string;
  
  // Bol.com integration
  bol_invoice_id?: string;
  bol_upload_status: 'pending' | 'uploaded' | 'failed';
  bol_upload_error?: string;
  
  // Email distribution
  email_sent: boolean;
  email_sent_at?: Date;
  email_error?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// Interface for Invoice creation (optional fields)
export interface InvoiceCreationAttributes extends Optional<InvoiceAttributes, 'id' | 'created_at' | 'updated_at'> {}

class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  public id!: string;
  public invoice_number!: string;
  public user_id!: string;
  public order_id!: string;
  public shipment_id?: string;
  public template_id!: string;
  
  // Customer information
  public customer_name!: string;
  public customer_email!: string;
  public customer_address!: string;
  public customer_city!: string;
  public customer_postal_code!: string;
  public customer_country!: string;
  public customer_vat_number?: string;
  
  // Seller information
  public seller_name!: string;
  public seller_address!: string;
  public seller_city!: string;
  public seller_postal_code!: string;
  public seller_country!: string;
  public seller_vat_number!: string;
  public seller_email!: string;
  public seller_phone?: string;
  
  // Invoice details
  public invoice_date!: Date;
  public due_date!: Date;
  public currency!: string;
  public subtotal!: number;
  public vat_total!: number;
  public total_amount!: number;
  
  // Status and metadata
  public status!: 'draft' | 'generated' | 'sent' | 'paid' | 'cancelled';
  public language!: 'nl' | 'fr' | 'en';
  public notes?: string;
  
  // Bol.com integration
  public bol_invoice_id?: string;
  public bol_upload_status!: 'pending' | 'uploaded' | 'failed';
  public bol_upload_error?: string;
  
  // Email distribution
  public email_sent!: boolean;
  public email_sent_at?: Date;
  public email_error?: string;
  
  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associations
  public readonly items?: any[];
  public readonly template?: any;
  public readonly auditLogs?: any[];
  public readonly bolMapping?: any;
}

export function initInvoiceModel(sequelizeInstance: Sequelize) {
  Invoice.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      invoice_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      order_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      shipment_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      template_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      // ... rest of the fields ...
      customer_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      customer_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      customer_address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      customer_city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      customer_postal_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      customer_country: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      customer_vat_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      seller_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      seller_address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      seller_city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      seller_postal_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      seller_country: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      seller_vat_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      seller_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      seller_phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      invoice_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      vat_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('draft', 'generated', 'sent', 'paid', 'cancelled'),
        allowNull: false,
      },
      language: {
        type: DataTypes.ENUM('nl', 'fr', 'en'),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bol_invoice_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      bol_upload_status: {
        type: DataTypes.ENUM('pending', 'uploaded', 'failed'),
        allowNull: false,
      },
      bol_upload_error: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      email_sent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      email_sent_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      email_error: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize: sequelizeInstance,
      tableName: 'invoices',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['order_id'] },
        { fields: ['status'] }
      ]
    }
  );
}

export default Invoice; 