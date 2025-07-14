import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { sequelize } from '@/config/database';

// Interface for InvoiceSettings attributes
export interface InvoiceSettingsAttributes {
  id: string;
  user_id: string;
  
  // Invoice numbering
  invoice_number_prefix: string;
  invoice_number_start: number;
  invoice_number_format: string;
  
  // Email settings
  email_subject_template: string;
  email_body_template: string;
  auto_send_email: boolean;
  
  // Default values
  default_currency: string;
  default_language: 'nl' | 'fr' | 'en';
  default_payment_terms: number;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// Interface for InvoiceSettings creation (optional fields)
export interface InvoiceSettingsCreationAttributes extends Optional<InvoiceSettingsAttributes, 'id' | 'created_at' | 'updated_at'> {}

class InvoiceSettings extends Model<InvoiceSettingsAttributes, InvoiceSettingsCreationAttributes> implements InvoiceSettingsAttributes {
  public id!: string;
  public user_id!: string;
  
  // Invoice numbering
  public invoice_number_prefix!: string;
  public invoice_number_start!: number;
  public invoice_number_format!: string;
  
  // Email settings
  public email_subject_template!: string;
  public email_body_template!: string;
  public auto_send_email!: boolean;
  
  // Default values
  public default_currency!: string;
  public default_language!: 'nl' | 'fr' | 'en';
  public default_payment_terms!: number;
  
  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

// Remove InvoiceSettings.init(...) at the top level
// Export an initialization function
export function initInvoiceSettingsModel(sequelizeInstance: Sequelize) {
  InvoiceSettings.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      settings_json: {
        type: DataTypes.JSONB,
        allowNull: false,
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
      tableName: 'invoice_settings',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['user_id'] }
      ]
    }
  );
}

export default InvoiceSettings; 