import { Router } from 'express';
import * as SettingsController from '../controllers/settings.controller';
import { getGeneralSettingsHandler, saveGeneralSettingsHandler } from '../controllers/settings.controller';
import { getCouplingBolHandler, saveCouplingBolHandler } from '../controllers/settings.controller';

const router = Router();

// Account Details routes (user-specific, identified by X-User-ID header)
router.get('/account', SettingsController.getAccountDetailsHandler);
router.post('/account', SettingsController.saveAccountDetailsHandler);

// User Onboarding Status routes (user-specific, identified by X-User-ID header)
router.get('/onboarding/status', SettingsController.getOnboardingStatusHandler);
router.post('/onboarding/step', SettingsController.updateOnboardingStepHandler); // General endpoint to update any step based on body

// VAT Settings routes (system-wide)
router.post('/vat', SettingsController.createVatSettingHandler);
router.get('/vat', SettingsController.getAllVatSettingsHandler);
router.get('/vat/:id', SettingsController.getVatSettingByIdHandler);
router.put('/vat/:id', SettingsController.updateVatSettingHandler);
router.delete('/vat/:id', SettingsController.deleteVatSettingHandler);

// Invoice Settings routes
router.get('/invoice', SettingsController.getInvoiceSettingsHandler);
router.post('/invoice', SettingsController.saveInvoiceSettingsHandler); // Using POST for save/update of single resource

router.get('/general', getGeneralSettingsHandler);
router.post('/general', saveGeneralSettingsHandler);

router.get('/coupling-bol', getCouplingBolHandler);
router.post('/coupling-bol', saveCouplingBolHandler);

export default router;
