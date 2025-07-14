import {
  Model,
  DataTypes,
  Optional,
  Sequelize
} from 'sequelize';
import { sequelize } from '@/config/database';

// Interface for VatRule attributes
export interface VatRuleAttributes {
  id: string;
  name: string;
  rate: number;
  country_code: string;
  is_default: boolean;
  is_active: boolean;
  description?: string;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// Interface for VatRule creation (optional fields)
export interface VatRuleCreationAttributes extends Optional<VatRuleAttributes, 'id' | 'created_at' | 'updated_at'> {}

class VatRule extends Model<VatRuleAttributes, VatRuleCreationAttributes> implements VatRuleAttributes {
  public id!: string;
  public name!: string;
  public rate!: number;
  public country_code!: string;
  public is_default!: boolean;
  public is_active!: boolean;
  public description?: string;
  
  // Timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associations
  public readonly invoiceItems?: any[];
}

// Remove VatRule.init(...) at the top level
// Export an initialization function
export function initVatRuleModel(sequelizeInstance: Sequelize) {
  VatRule.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      rate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      country_code: {
        type: DataTypes.STRING(2),
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
      description: {
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
      tableName: 'vat_rules',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['country_code'] },
        { fields: ['is_default'] },
        { fields: ['is_active'] }
      ]
    }
  );
}

export default VatRule; 