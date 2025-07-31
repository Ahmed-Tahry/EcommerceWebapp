
import { Request, Response, NextFunction } from 'express';
import * as SettingsService from '../services/settings.service';
import { IAccountDetails, IVatSetting, IInvoiceSettings, IUserOnboardingStatus, IGeneralSettings, IShop } from '../models/settings.model';

// Middleware to extract and validate userId (for shop-related handlers)
const validateUserId = (req: Request, res: Response, next: NextFunction): void => {
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
const validateUserAndShopId = (req: Request, res: Response, next: NextFunction): void => {
  let userId = req.headers['x-user-id'] as string | undefined || (req.user as { id?: string } | undefined)?.id;
  let shopId = req.headers['x-shop-id'] as string | undefined;
  if (!userId && req.query?.userId) {
    userId = req.query.userId as string;
  }
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

// --- Account Details Handlers ---
export const getAccountDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shopId = req.shopId as string;
    const details = await SettingsService.getAccountDetailsByShopId(shopId);
    if (details) {
      res.status(200).json(details);
    } else {
      res.status(404).json({ message: `Account details not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error fetching account details for shopId ${req.shopId}:`, error);
    next(error);
  }
};

export const saveAccountDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const shopId = req.shopId as string;
    const { bolClientId, bolClientSecret } = req.body;
    if (bolClientId === undefined && bolClientSecret === undefined) {
      return res.status(400).json({ message: 'Request body must contain at least one of: bolClientId, bolClientSecret.' });
    }
    const detailsToSave: Partial<Omit<IAccountDetails, 'id' | 'userId' | 'shopId' | 'createdAt' | 'updatedAt'>> = {};
    if (bolClientId !== undefined) detailsToSave.bolClientId = bolClientId;
    if (bolClientSecret !== undefined) detailsToSave.bolClientSecret = bolClientSecret;
    const savedDetails = await SettingsService.saveAccountDetails(userId, shopId, detailsToSave);
    res.status(200).json(savedDetails);
  } catch (error) {
    console.error(`Error saving account details for userId ${req.userId}:`, error);
    next(error);
  }
};

// --- VAT Settings Handlers (System-Wide, Unchanged) ---
export const createVatSettingHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, rate, isDefault } = req.body;
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Invalid input: name must be a non-empty string.' });
    }
    if (typeof rate !== 'number' || rate < 0 || rate > 100) {
      return res.status(400).json({ message: 'Invalid input: rate must be a number between 0 and 100.' });
    }
    const newSetting = await SettingsService.createVatSetting({ name, rate, isDefault: Boolean(isDefault) });
    res.status(201).json(newSetting);
  } catch (error) {
    console.error('Error creating VAT setting:', error);
    next(error);
  }
};

export const getAllVatSettingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await SettingsService.getAllVatSettings();
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching all VAT settings:', error);
    next(error);
  }
};

export const getVatSettingByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const setting = await SettingsService.getVatSettingById(id);
    if (setting) {
      res.status(200).json(setting);
    } else {
      res.status(404).json({ message: `VAT setting with ID ${id} not found.` });
    }
  } catch (error) {
    console.error(`Error fetching VAT setting ID ${req.params.id}:`, error);
    next(error);
  }
};

export const updateVatSettingHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, rate, isDefault } = req.body;
    const updates: Partial<Omit<IVatSetting, 'id' | 'createdAt' | 'updatedAt'>> = {};
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') return res.status(400).json({ message: 'Name must be a non-empty string.' });
      updates.name = name;
    }
    if (rate !== undefined) {
      if (typeof rate !== 'number' || rate < 0 || rate > 100) return res.status(400).json({ message: 'Rate must be a number between 0 and 100.' });
      updates.rate = rate;
    }
    if (isDefault !== undefined) updates.isDefault = Boolean(isDefault);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update.' });
    }
    const updatedSetting = await SettingsService.updateVatSetting(id, updates);
    if (updatedSetting) {
      res.status(200).json(updatedSetting);
    } else {
      res.status(404).json({ message: `VAT setting with ID ${id} not found, or no changes made.` });
    }
  } catch (error) {
    console.error(`Error updating VAT setting ID ${req.params.id}:`, error);
    next(error);
  }
};

export const deleteVatSettingHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const success = await SettingsService.deleteVatSetting(id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: `VAT setting with ID ${id} not found.` });
    }
  } catch (error) {
    console.error(`Error deleting VAT setting ID ${req.params.id}:`, error);
    next(error);
  }
};

// --- Invoice Settings Handlers ---
export const getInvoiceSettingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shopId = req.shopId as string;
    const settings = await SettingsService.getInvoiceSettings(shopId);
    res.status(200).json(settings);
  } catch (error) {
    console.error(`Error fetching invoice settings for shopId ${req.shopId}:`, error);
    next(error);
  }
};

export const saveInvoiceSettingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const shopId = req.shopId as string;
    const { defaultInvoiceNotes, invoicePrefix, nextInvoiceNumber, bankAccount, startNumber, fileNameBase } = req.body;
    const settingsToSave: Partial<Omit<IInvoiceSettings, 'shopId' | 'createdAt' | 'updatedAt'>> = {};
    if (defaultInvoiceNotes !== undefined) settingsToSave.defaultInvoiceNotes = defaultInvoiceNotes;
    if (invoicePrefix !== undefined) settingsToSave.invoicePrefix = invoicePrefix;
    if (nextInvoiceNumber !== undefined) {
      const num = Number(nextInvoiceNumber);
      if (isNaN(num) || num < 0) return res.status(400).json({ message: 'nextInvoiceNumber must be a non-negative number.' });
      settingsToSave.nextInvoiceNumber = num;
    }
    if (bankAccount !== undefined) settingsToSave.bankAccount = bankAccount;
    if (startNumber !== undefined) settingsToSave.startNumber = startNumber;
    if (fileNameBase !== undefined) settingsToSave.fileNameBase = fileNameBase;
    if (Object.keys(settingsToSave).length === 0 && Object.keys(req.body).length > 0) {
      return res.status(400).json({ message: 'No valid fields provided for update.' });
    }
    if (Object.keys(settingsToSave).length === 0) {
      const currentSettings = await SettingsService.getInvoiceSettings(shopId);
      return res.status(200).json(currentSettings);
    }

    console.log(`saveInvoiceSettingsHandler: Processing for userId ${userId}, shopId ${shopId}`);

    // 1. Check/Create shop FIRST (before saving invoice settings)
    let shop = await SettingsService.getShopByShopId(userId, shopId);
    if (!shop) {
      console.log(`saveInvoiceSettingsHandler: Creating new shop with shopId ${shopId}`);
      shop = await SettingsService.createShop({
        userId,
        shopId,
        name: `Shop ${shopId.substring(0, 8)}...`,
        description: 'Auto-created shop for invoice settings'
      });
      console.log(`saveInvoiceSettingsHandler: New shop created:`, shop);
    } else {
      console.log(`saveInvoiceSettingsHandler: Existing shop found:`, shop);
    }

    // 2. Save invoice settings AFTER shop is created
    const updated = await SettingsService.saveInvoiceSettings(shopId, settingsToSave);
    res.status(200).json(updated);
  } catch (error) {
    console.error(`Error saving invoice settings for shopId ${req.shopId}:`, error);
    next(error);
  }
};

// --- General Settings Handlers ---
export const getGeneralSettingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shopId = req.shopId as string;
    const settings = await SettingsService.getGeneralSettings(shopId);
    if (settings) {
      res.status(200).json(settings);
    } else {
      res.status(404).json({ message: `General settings not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error fetching general settings for shopId ${req.shopId}:`, error);
    next(error);
  }
};

export const saveGeneralSettingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const shopId = req.shopId as string;
    
    console.log(`saveGeneralSettingsHandler: Processing for userId ${userId}, shopId ${shopId}`);

    // 1. Check/Create shop FIRST (before saving general settings)
    let shop = await SettingsService.getShopByShopId(userId, shopId);
    if (!shop) {
      console.log(`saveGeneralSettingsHandler: Creating new shop with shopId ${shopId}`);
      shop = await SettingsService.createShop({
        userId,
        shopId,
        name: `Shop ${shopId.substring(0, 8)}...`,
        description: 'Auto-created shop for general settings'
      });
      console.log(`saveGeneralSettingsHandler: New shop created:`, shop);
    } else {
      console.log(`saveGeneralSettingsHandler: Existing shop found:`, shop);
    }

    // 2. Save general settings AFTER shop is created
    const updated = await SettingsService.saveGeneralSettings(shopId, req.body);
    res.status(200).json(updated);
  } catch (error) {
    console.error(`Error saving general settings for shopId ${req.shopId}:`, error);
    next(error);
  }
};

// --- Coupling Bol Handlers ---
export const getCouplingBolHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shopId = req.shopId as string;
    const details = await SettingsService.getAccountDetailsByShopId(shopId);
    if (details) {
      res.status(200).json(details);
    } else {
      res.status(404).json({ message: `Coupling Bol details not found for shopId ${shopId}.` });
    }
  } catch (error) {
    console.error(`Error fetching Bol coupling details for shopId ${req.shopId}:`, error);
    next(error);
  }
};

export const saveCouplingBolHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const { bolClientId, bolClientSecret, shopName, shopDescription } = req.body;
    const shopId = bolClientId; // Use bolClientId as the shopId

    if (!bolClientId || !bolClientSecret) {
      return res.status(400).json({ message: 'bolClientId and bolClientSecret are required.' });
    }

    console.log(`saveCouplingBolHandler: Processing for userId ${userId}, shopId ${shopId}`);

    // 1. Create the shop
    const shopData = {
      userId,
      shopId,
      name: shopName || `Bol.com Shop (${shopId})`,
      description: shopDescription || 'Bol.com connected store',
    };
    const shop = await SettingsService.createShop(shopData);

    // 2. Save Bol.com credentials
    const accountDetails = {
      bolClientId,
      bolClientSecret,
    };
    const updated = await SettingsService.saveAccountDetails(userId, shopId, accountDetails);

    // 3. Update onboarding status
    const updatedStatus = await SettingsService.updateOnboardingStatus(userId, shopId, {
      hasConfiguredBolApi: true,
    });

    console.log(`saveCouplingBolHandler: Onboarding status updated:`, updatedStatus);

    res.status(200).json({
      settings: updated,
      onboardingStatus: updatedStatus
    });
  } catch (error) {
    console.error(`Error saving Bol coupling for shopId ${req.shopId}:`, error);
    next(error);
  }
};

// --- Onboarding Status Handlers ---
export const getOnboardingStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const shopId = req.shopId as string;
    const status = await SettingsService.getOnboardingStatus(userId, shopId);
    res.status(200).json(status);
  } catch (error) {
    console.error(`Error fetching onboarding status for userId ${req.userId}, shopId ${req.shopId}:`, error);
    next(error);
  }
};

export const getUserOnboardingStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    // Get all shops for the user and their onboarding status
    const shops = await SettingsService.getShopsByUserId(userId);
    
    if (shops.length === 0) {
      // No shops yet, return default status
      const defaultStatus = {
        hasConfiguredBolApi: false,
        hasCompletedShopSync: false,
        hasCompletedInvoiceSetup: false
      };
      res.status(200).json(defaultStatus);
      return;
    }
    
    // Get onboarding status for the first shop (or most recent)
    const firstShop = shops[0];
    const status = await SettingsService.getOnboardingStatus(userId, firstShop.shopId);
    res.status(200).json(status);
  } catch (error) {
    console.error(`Error fetching user onboarding status for userId ${req.userId}:`, error);
    next(error);
  }
};

export const updateUserOnboardingStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    // Get all shops for the user
    const shops = await SettingsService.getShopsByUserId(userId);
    
    if (shops.length === 0) {
      // No shops yet, return the updated status without saving to database
      const updates: Partial<Omit<IUserOnboardingStatus, 'userId' | 'shopId' | 'createdAt' | 'updatedAt'>> = {};
      const { hasConfiguredBolApi, hasCompletedShopSync, hasCompletedInvoiceSetup } = req.body;
      if (typeof hasConfiguredBolApi === 'boolean') updates.hasConfiguredBolApi = hasConfiguredBolApi;
      if (typeof hasCompletedShopSync === 'boolean') updates.hasCompletedShopSync = hasCompletedShopSync;
      if (typeof hasCompletedInvoiceSetup === 'boolean') updates.hasCompletedInvoiceSetup = hasCompletedInvoiceSetup;
      
      const defaultStatus = {
        hasConfiguredBolApi: false,
        hasCompletedShopSync: false,
        hasCompletedInvoiceSetup: false,
        ...updates
      };
      res.status(200).json(defaultStatus);
      return;
    }
    
    // Update onboarding status for the first shop
    const firstShop = shops[0];
    const updates: Partial<Omit<IUserOnboardingStatus, 'userId' | 'shopId' | 'createdAt' | 'updatedAt'>> = {};
    const { hasConfiguredBolApi, hasCompletedShopSync, hasCompletedInvoiceSetup } = req.body;
    if (typeof hasConfiguredBolApi === 'boolean') updates.hasConfiguredBolApi = hasConfiguredBolApi;
    if (typeof hasCompletedShopSync === 'boolean') updates.hasCompletedShopSync = hasCompletedShopSync;
    if (typeof hasCompletedInvoiceSetup === 'boolean') updates.hasCompletedInvoiceSetup = hasCompletedInvoiceSetup;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid onboarding step data provided in the request body.' });
    }
    
    const updatedStatus = await SettingsService.updateOnboardingStatus(userId, firstShop.shopId, updates);
    res.status(200).json(updatedStatus);
  } catch (error) {
    console.error(`Error updating user onboarding status for userId ${req.userId}:`, error);
    next(error);
  }
};

export const updateOnboardingStepHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const shopId = req.shopId as string;
    const updates: Partial<Omit<IUserOnboardingStatus, 'userId' | 'shopId' | 'createdAt' | 'updatedAt'>> = {};
    const { hasConfiguredBolApi, hasCompletedShopSync, hasCompletedInvoiceSetup, hasCompletedVatSetup } = req.body;
    if (typeof hasConfiguredBolApi === 'boolean') updates.hasConfiguredBolApi = hasConfiguredBolApi;
    if (typeof hasCompletedShopSync === 'boolean') updates.hasCompletedShopSync = hasCompletedShopSync;
    if (typeof hasCompletedInvoiceSetup === 'boolean') updates.hasCompletedInvoiceSetup = hasCompletedInvoiceSetup;
    if (typeof hasCompletedVatSetup === 'boolean') updates.hasCompletedVatSetup = hasCompletedVatSetup;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid onboarding step data provided in the request body.' });
    }
    const updatedStatus = await SettingsService.updateOnboardingStatus(userId, shopId, updates);
    res.status(200).json(updatedStatus);
  } catch (error) {
    console.error(`Error updating onboarding status for userId ${req.userId}, shopId ${req.shopId}:`, error);
    next(error);
  }
};

// --- Shop Handlers ---
export const createShopHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const { shopId, name, description } = req.body;
    if (!shopId || !name) {
      return res.status(400).json({ message: 'shopId and name are required.' });
    }
    const shopData: Omit<IShop, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      shopId,
      name,
      description,
    };
    const shop = await SettingsService.createShop(shopData);
    res.status(201).json(shop);
  } catch (error) {
    console.error(`Error creating shop for userId ${req.userId}:`, error);
    next(error);
  }
};

export const getShopsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const shops = await SettingsService.getShopsByUserId(userId);
    res.status(200).json(shops);
  } catch (error) {
    console.error(`Error fetching shops for userId ${req.userId}:`, error);
    next(error);
  }
};

export const getShopByShopIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const { shopId } = req.params;
    const shop = await SettingsService.getShopByShopId(userId, shopId);
    if (shop) {
      res.status(200).json(shop);
    } else {
      res.status(404).json({ message: `Shop with shopId ${shopId} not found for userId ${userId}.` });
    }
  } catch (error) {
    console.error(`Error fetching shop with shopId ${req.params.shopId} for userId ${req.userId}:`, error);
    next(error);
  }
};

export const updateShopHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const { shopId } = req.params;
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Shop name is required.' });
    }
    
    const shopData: Partial<Omit<IShop, 'id' | 'userId' | 'shopId' | 'createdAt' | 'updatedAt'>> = {
      name,
      description,
    };
    
    const updatedShop = await SettingsService.updateShop(userId, shopId, shopData);
    if (updatedShop) {
      res.status(200).json(updatedShop);
    } else {
      res.status(404).json({ message: `Shop with shopId ${shopId} not found for userId ${userId}.` });
    }
  } catch (error) {
    console.error(`Error updating shop with shopId ${req.params.shopId} for userId ${req.userId}:`, error);
    next(error);
  }
};

export const deleteShopHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId as string;
    const { shopId } = req.params;
    
    const deleted = await SettingsService.deleteShop(userId, shopId);
    if (deleted) {
      res.status(200).json({ message: `Shop with shopId ${shopId} deleted successfully.` });
    } else {
      res.status(404).json({ message: `Shop with shopId ${shopId} not found for userId ${userId}.` });
    }
  } catch (error) {
    console.error(`Error deleting shop with shopId ${req.params.shopId} for userId ${req.userId}:`, error);
    next(error);
  }
};
