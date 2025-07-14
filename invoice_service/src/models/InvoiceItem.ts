import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { sequelize } from '@/config/database';

// Interface for InvoiceItem attributes
export interface InvoiceItemAttributes {
  id: string;
  invoice_id: string;
  vat_rule_id: string;
  
  // Product information
  ean: string;
  product_name: string;
  product_description?: string;
  sku?: string;
  
  // Pricing and quantities
  quantity: number;
  unit_price: number;
  unit_price_excl_vat: number;
  vat_rate: number;
  vat_amount: number;
  line_total: number;
  line_total_excl_vat: number;
  
  // Bol.com integration
  bol_order_item_id?: string;
  bol_offer_id?: string;
  
  // Metadata
  notes?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// Interface for InvoiceItem creation (optional fields)
export interface InvoiceItemCreationAttributes extends Optional<InvoiceItemAttributes, 'id' | 'created_at' | 'updated_at'> {}

class InvoiceItem extends Model<InvoiceItemAttributes, InvoiceItemCreationAttributes> implements InvoiceItemAttributes {
  public id!: string;
  public invoice_id!: string;
  public vat_rule_id!: string;
  
  // Product information
  public ean!: string;
  public product_name!: string;
  public product_description?: string;
  public sku?: string;
  
  // Pricing and quantities
  public quantity!: number;
  public unit_price!: number;
  public unit_price_excl_vat!: number;
  public vat_rate!: number;
  public vat_amount!: number;
  public line_total!: number;
  public line_total_excl_vat!: number;
  
  // Bol.com integration
  public bol_order_item_id?: string;
  public bol_offer_id?: string;
  
  // Metadata
  public notes?: string;
  
  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associations
  public readonly invoice?: any;
  public readonly vatRule?: any;
}

// Export an initialization function
export function initInvoiceItemModel(sequelizeInstance: Sequelize) {
  InvoiceItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      invoice_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'invoices',
          key: 'id'
        }
      },
      vat_rule_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'vat_rules',
          key: 'id'
        }
      },
      ean: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      product_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      product_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sku: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      unit_price_excl_vat: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      vat_rate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      vat_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      line_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      line_total_excl_vat: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      bol_order_item_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      bol_offer_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      notes: {
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
      tableName: 'invoice_items',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['invoice_id'] },
        { fields: ['ean'] },
        { fields: ['bol_order_item_id'] },
        { fields: ['bol_offer_id'] }
      ]
    }
  );
}

export default InvoiceItem; 