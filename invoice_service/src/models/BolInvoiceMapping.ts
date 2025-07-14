import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { sequelize } from '@/config/database';

// Interface for BolInvoiceMapping attributes
export interface BolInvoiceMappingAttributes {
  id: string;
  invoice_id: string;
  bol_shipment_id: string;
  bol_order_id: string;
  bol_invoice_id?: string;
  bol_upload_status: 'pending' | 'uploaded' | 'failed';
  bol_upload_error?: string;
  bol_upload_response?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// Interface for BolInvoiceMapping creation (optional fields)
export interface BolInvoiceMappingCreationAttributes extends Optional<BolInvoiceMappingAttributes, 'id' | 'created_at' | 'updated_at'> {}

class BolInvoiceMapping extends Model<BolInvoiceMappingAttributes, BolInvoiceMappingCreationAttributes> implements BolInvoiceMappingAttributes {
  public id!: string;
  public invoice_id!: string;
  public bol_shipment_id!: string;
  public bol_order_id!: string;
  public bol_invoice_id?: string;
  public bol_upload_status!: 'pending' | 'uploaded' | 'failed';
  public bol_upload_error?: string;
  public bol_upload_response?: string;
  
  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associations
  public readonly invoice?: any;
}

// Remove BolInvoiceMapping.init(...) at the top level
// Export an initialization function
export function initBolInvoiceMappingModel(sequelizeInstance: Sequelize) {
  BolInvoiceMapping.init(
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
      bol_order_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      mapping_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
      },
      error_message: {
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
      tableName: 'bol_invoice_mappings',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['invoice_id'] },
        { fields: ['bol_order_id'] },
        { fields: ['status'] }
      ]
    }
  );
}

export default BolInvoiceMapping; 