import { Router } from 'express';
import * as SettingsController from '../controllers/settings.controller';

const router = Router();

// Middleware to extract and validate userId (for shop-related handlers)
const validateUserId = (req: any, res: any, next: any) => {
  let userId = req.headers['x-user-id'] as string | undefined || (req.user as { id?: string } | undefined)?.id;
  if (!userId && req.query?.userId) {
    userId = req.query.userId as string;
  }
  if (!userId) {
    res.status(401).json({ message: 'User ID must be provided in X-User-ID header, query parameter, or authentication.' });
    return;
  }
  req.userId = userId;
  next();
};

// Middleware to extract and validate userId and shopId (for most handlers)
const validateUserAndShopId = (req: any, res: any, next: any) => {
  let userId = req.headers['x-user-id'] as string | undefined || (req.user as { id?: string } | undefined)?.id;
  if (!userId && req.query?.userId) {
    userId = req.query.userId as string;
  }
  let shopId = req.headers['x-shop-id'] as string | undefined;
  if (!shopId && req.query?.shopId) {
    shopId = req.query.shopId as string;
  }
  if (!userId || !shopId) {
    res.status(401).json({ message: 'User ID and Shop ID must be provided in X-User-ID and X-Shop-ID headers or query parameters.' });
    return;
  }
  req.userId = userId;
  req.shopId = shopId;
  next();
};

// Account details routes
router.get('/account', validateUserAndShopId, SettingsController.getAccountDetailsHandler);
router.post('/account', validateUserAndShopId, SettingsController.saveAccountDetailsHandler);

// VAT settings routes
router.post('/vat', validateUserAndShopId, SettingsController.createVatSettingHandler);
router.get('/vat', validateUserAndShopId, SettingsController.getAllVatSettingsHandler);
router.get('/vat/:id', validateUserAndShopId, SettingsController.getVatSettingByIdHandler);
router.put('/vat/:id', validateUserAndShopId, SettingsController.updateVatSettingHandler);
router.delete('/vat/:id', validateUserAndShopId, SettingsController.deleteVatSettingHandler);

// Invoice settings routes
router.get('/invoice', validateUserAndShopId, SettingsController.getInvoiceSettingsHandler);
router.post('/invoice', validateUserAndShopId, SettingsController.saveInvoiceSettingsHandler);

// General settings routes
router.get('/general', validateUserAndShopId, SettingsController.getGeneralSettingsHandler);
router.post('/general', validateUserAndShopId, SettingsController.saveGeneralSettingsHandler);

// Coupling Bol routes - Use validateUserId since we're creating a new shop
router.get('/coupling-bol', validateUserAndShopId, SettingsController.getCouplingBolHandler);
router.post('/coupling-bol', validateUserId, SettingsController.saveCouplingBolHandler);

// Onboarding status routes
router.get('/onboarding/status', validateUserAndShopId, SettingsController.getOnboardingStatusHandler);
router.get('/onboarding/user-status', validateUserId, SettingsController.getUserOnboardingStatusHandler);
router.post('/onboarding/status', validateUserAndShopId, SettingsController.updateOnboardingStepHandler);
router.post('/onboarding/user-status', validateUserId, SettingsController.updateUserOnboardingStatusHandler);

// Shop routes
router.post('/shops', validateUserId, SettingsController.createShopHandler);
router.get('/shops', validateUserId, SettingsController.getShopsHandler);
router.get('/shops/:shopId', validateUserAndShopId, SettingsController.getShopByShopIdHandler);
router.put('/shops/:shopId', validateUserAndShopId, SettingsController.updateShopHandler);
router.delete('/shops/:shopId', validateUserAndShopId, SettingsController.deleteShopHandler);

export default router;