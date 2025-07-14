import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { sequelize } from '@/config/database';

// Interface for InvoiceAuditLog attributes
export interface InvoiceAuditLogAttributes {
  id: string;
  invoice_id: string;
  user_id: string;
  action: 'created' | 'generated' | 'sent' | 'uploaded' | 'downloaded' | 'cancelled' | 'updated';
  details?: string;
  ip_address?: string;
  user_agent?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// Interface for InvoiceAuditLog creation (optional fields)
export interface InvoiceAuditLogCreationAttributes extends Optional<InvoiceAuditLogAttributes, 'id' | 'created_at' | 'updated_at'> {}

class InvoiceAuditLog extends Model<InvoiceAuditLogAttributes, InvoiceAuditLogCreationAttributes> implements InvoiceAuditLogAttributes {
  public id!: string;
  public invoice_id!: string;
  public user_id!: string;
  public action!: 'created' | 'generated' | 'sent' | 'uploaded' | 'downloaded' | 'cancelled' | 'updated';
  public details?: string;
  public ip_address?: string;
  public user_agent?: string;
  
  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associations
  public readonly invoice?: any;
}

// Export an initialization function
export function initInvoiceAuditLogModel(sequelizeInstance: Sequelize) {
  InvoiceAuditLog.init(
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
      user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      user_agent: {
        type: DataTypes.STRING(500),
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
      tableName: 'invoice_audit_logs',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['invoice_id'] },
        { fields: ['user_id'] },
        { fields: ['action'] },
        { fields: ['created_at'] }
      ]
    }
  );
}

export default InvoiceAuditLog; 