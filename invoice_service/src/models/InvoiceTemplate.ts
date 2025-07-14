import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { sequelize } from '@/config/database';

// Interface for InvoiceTemplate attributes
export interface InvoiceTemplateAttributes {
  id: string;
  user_id: string;
  name: string;
  is_default: boolean;
  is_active: boolean;
  
  // Template content
  header_html: string;
  footer_html: string;
  css_styles: string;
  
  // Template settings
  logo_url?: string;
  company_info: string;
  terms_conditions?: string;
  payment_instructions?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// Interface for InvoiceTemplate creation (optional fields)
export interface InvoiceTemplateCreationAttributes extends Optional<InvoiceTemplateAttributes, 'id' | 'created_at' | 'updated_at'> {}

class InvoiceTemplate extends Model<InvoiceTemplateAttributes, InvoiceTemplateCreationAttributes> implements InvoiceTemplateAttributes {
  public id!: string;
  public user_id!: string;
  public name!: string;
  public is_default!: boolean;
  public is_active!: boolean;
  
  // Template content
  public header_html!: string;
  public footer_html!: string;
  public css_styles!: string;
  
  // Template settings
  public logo_url?: string;
  public company_info!: string;
  public terms_conditions?: string;
  public payment_instructions?: string;
  
  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associations
  public readonly invoices?: any[];
}

// Remove InvoiceTemplate.init(...) at the top level
// Export an initialization function
export function initInvoiceTemplateModel(sequelizeInstance: Sequelize) {
  InvoiceTemplate.init(
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
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      header_html: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      footer_html: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      css_styles: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      logo_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      company_info: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      terms_conditions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      payment_instructions: {
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
      tableName: 'invoice_templates',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['is_default'] },
        { fields: ['is_active'] }
      ]
    }
  );
}

export default InvoiceTemplate; 