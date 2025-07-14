import { sequelize } from '../config/database';
import Invoice, { initInvoiceModel } from './Invoice';
import InvoiceItem, { initInvoiceItemModel } from './InvoiceItem';
import InvoiceTemplate, { initInvoiceTemplateModel } from './InvoiceTemplate';
import InvoiceSettings, { initInvoiceSettingsModel } from './InvoiceSettings';
import VatRule, { initVatRuleModel } from './VatRule';
import InvoiceAuditLog, { initInvoiceAuditLogModel } from './InvoiceAuditLog';
import BolInvoiceMapping, { initBolInvoiceMappingModel } from './BolInvoiceMapping';

const defineAssociations = () => {
  Invoice.hasMany(InvoiceItem, {
    foreignKey: 'invoice_id',
    as: 'items',
    onDelete: 'CASCADE'
  });
  InvoiceItem.belongsTo(Invoice, {
    foreignKey: 'invoice_id',
    as: 'invoice'
  });
  Invoice.belongsTo(InvoiceTemplate, {
    foreignKey: 'template_id',
    as: 'template'
  });
  InvoiceTemplate.hasMany(Invoice, {
    foreignKey: 'template_id',
    as: 'invoices'
  });
  InvoiceItem.belongsTo(VatRule, {
    foreignKey: 'vat_rule_id',
    as: 'vatRule'
  });
  VatRule.hasMany(InvoiceItem, {
    foreignKey: 'vat_rule_id',
    as: 'invoiceItems'
  });
  Invoice.hasMany(InvoiceAuditLog, {
    foreignKey: 'invoice_id',
    as: 'auditLogs',
    onDelete: 'CASCADE'
  });
  InvoiceAuditLog.belongsTo(Invoice, {
    foreignKey: 'invoice_id',
    as: 'invoice'
  });
  Invoice.hasOne(BolInvoiceMapping, {
    foreignKey: 'invoice_id',
    as: 'bolMapping',
    onDelete: 'CASCADE'
  });
  BolInvoiceMapping.belongsTo(Invoice, {
    foreignKey: 'invoice_id',
    as: 'invoice'
  });
};

export const initializeModels = async () => {
  try {
    // Initialize all models
    initInvoiceModel(sequelize);
    initInvoiceItemModel(sequelize);
    initVatRuleModel(sequelize);
    initInvoiceTemplateModel(sequelize);
    initInvoiceSettingsModel(sequelize);
    initInvoiceAuditLogModel(sequelize);
    initBolInvoiceMappingModel(sequelize);
    defineAssociations();
    await sequelize.sync({ alter: true });
    console.log('Invoice Service: Database models synchronized successfully.');
  } catch (error) {
    console.error('Invoice Service: Error synchronizing database models:', error);
    throw error;
  }
};

export {
  Invoice,
  InvoiceItem,
  InvoiceTemplate,
  InvoiceSettings,
  VatRule,
  InvoiceAuditLog,
  BolInvoiceMapping
};

export default sequelize; 