import { Router } from 'express';
import * as SettingsController from '../controllers/settings.controller';

const router = Router();

// Account Details routes
router.get('/account', SettingsController.getAccountDetailsHandler);
router.post('/account', SettingsController.saveAccountDetailsHandler); // Using POST for save/update of single resource

// VAT Settings routes
router.post('/vat', SettingsController.createVatSettingHandler);
router.get('/vat', SettingsController.getAllVatSettingsHandler);
router.get('/vat/:id', SettingsController.getVatSettingByIdHandler);
router.put('/vat/:id', SettingsController.updateVatSettingHandler);
router.delete('/vat/:id', SettingsController.deleteVatSettingHandler);

// Invoice Settings routes
router.get('/invoice', SettingsController.getInvoiceSettingsHandler);
router.post('/invoice', SettingsController.saveInvoiceSettingsHandler); // Using POST for save/update of single resource

export default router;
