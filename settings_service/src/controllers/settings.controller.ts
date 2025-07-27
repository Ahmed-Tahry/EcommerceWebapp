import { Request, Response, NextFunction } from 'express';
import * as SettingsService from '../services/settings.service';
import { IAccountDetails, IVatSetting, IInvoiceSettings, IUserOnboardingStatus } from '../models/settings.model';
import { getGeneralSettings, saveGeneralSettings } from '../services/settings.service';

// --- Account Details Handlers (Per-User) ---
export const getAccountDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId = req.headers['x-user-id'] as string;
    if (!userId && req.query && req.query.userId) {
      userId = req.query.userId as string;
    }

    if (!userId) {
      return res.status(401).json({ message: 'User ID not provided in X-User-ID header or query parameter.' });
    }
    const details = await SettingsService.getAccountDetailsByUserId(userId);
    if (details) {
      // SECURITY NOTE: Consider redacting bolClientSecret before sending to client
      // const { bolClientSecret, ...safeDetails } = details;
      // res.status(200).json(safeDetails);
      res.status(200).json(details);
    } else {
      // Service attempts to create a default if null, so this means creation might have failed or still null.
      // Or, it could mean no settings yet for this user, which is a valid state.
      // Let's return 200 with nulls if that's the case, or 404 if service explicitly returns null for "not found".
      // Based on current service, it will return null if not found.
      res.status(404).json({ message: 'Account details not found for this user.' });
    }
  } catch (error) {
    next(error);
  }
};

export const saveAccountDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId = req.headers['x-user-id'] as string;
    if (!userId && req.body && req.body.userId) {
      userId = req.body.userId as string;
      // Ensure userId from body is not passed along with other details to the service
      // if your service's saveAccountDetails expects only specific fields.
      // However, SettingsService.saveAccountDetails takes userId as a separate first param.
    }

    if (!userId) {
      return res.status(401).json({ message: 'User ID not provided in X-User-ID header or request body.' });
    }

    const { bolClientId, bolClientSecret } = req.body;
    if (bolClientId === undefined && bolClientSecret === undefined) {
        return res.status(400).json({ message: 'Request body must contain at least one of: bolClientId, bolClientSecret.' });
    }

    const detailsToSave: Partial<Omit<IAccountDetails, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> = {};
    if (bolClientId !== undefined) detailsToSave.bolClientId = bolClientId;
    if (bolClientSecret !== undefined) detailsToSave.bolClientSecret = bolClientSecret;

    const savedDetails = await SettingsService.saveAccountDetails(userId, detailsToSave);
    // SECURITY NOTE: Redact bolClientSecret from response
    // const { bolClientSecret: _, ...safeResponse } = savedDetails;
    // res.status(200).json(safeResponse);
    res.status(200).json(savedDetails);
  } catch (error) {
    next(error);
  }
};


// --- VAT Settings Handlers (Remain System-Wide) ---
export const createVatSettingHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, rate, isDefault } = req.body;
    if (typeof name !== 'string' || name.trim() === '' || typeof rate !== 'number') {
      return res.status(400).json({ message: 'Invalid input: name (string, non-empty) and rate (number) are required.' });
    }
    if (rate < 0 || rate > 100) {
        return res.status(400).json({ message: 'Invalid input: rate must be between 0 and 100.' });
    }
    const newSetting = await SettingsService.createVatSetting({ name, rate, isDefault: Boolean(isDefault) });
    res.status(201).json(newSetting);
  } catch (error) {
    next(error);
  }
};

export const getAllVatSettingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await SettingsService.getAllVatSettings();
    res.status(200).json(settings);
  } catch (error) {
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
    next(error);
  }
};

export const updateVatSettingHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, rate, isDefault } = req.body;

    const updates: Partial<Omit<IVatSetting, 'id' | 'createdAt' | 'updatedAt'>> = {};
    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim() === '') return res.status(400).json({message: 'Name must be a non-empty string.'});
        updates.name = name;
    }
    if (rate !== undefined) {
        if (typeof rate !== 'number' || rate < 0 || rate > 100) return res.status(400).json({message: 'Rate must be a number between 0 and 100.'});
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
    next(error);
  }
};

export const deleteVatSettingHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const success = await SettingsService.deleteVatSetting(id);
    if (success) {
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ message: `VAT setting with ID ${id} not found.` });
    }
  } catch (error) {
    next(error);
  }
};

// --- Invoice Settings Handlers ---
export const getInvoiceSettingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const settings = await SettingsService.getInvoiceSettings(userId);
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

export const saveInvoiceSettingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const { companyName, companyAddress, companyPhone, companyEmail, vatNumber, defaultInvoiceNotes, invoicePrefix, nextInvoiceNumber, bankAccount, startNumber, fileNameBase } = req.body;
    const settingsToSave: Partial<Omit<IInvoiceSettings, 'userId' | 'createdAt' | 'updatedAt'>> = {};

    if(companyName !== undefined) settingsToSave.companyName = companyName; // Allow null/empty string to clear
    if(companyAddress !== undefined) settingsToSave.companyAddress = companyAddress;
    if(companyPhone !== undefined) settingsToSave.companyPhone = companyPhone;
    if(companyEmail !== undefined) settingsToSave.companyEmail = companyEmail;
    if(vatNumber !== undefined) settingsToSave.vatNumber = vatNumber;
    if(defaultInvoiceNotes !== undefined) settingsToSave.defaultInvoiceNotes = defaultInvoiceNotes;
    if(invoicePrefix !== undefined) settingsToSave.invoicePrefix = invoicePrefix;
    if(nextInvoiceNumber !== undefined) {
        const num = Number(nextInvoiceNumber);
        if (isNaN(num) || num < 0) return res.status(400).json({message: "nextInvoiceNumber must be a non-negative number."});
        settingsToSave.nextInvoiceNumber = num;
    }
    if(bankAccount !== undefined) settingsToSave.bankAccount = bankAccount;
    if(startNumber !== undefined) settingsToSave.startNumber = startNumber;
    if(fileNameBase !== undefined) settingsToSave.fileNameBase = fileNameBase;

    if (Object.keys(settingsToSave).length === 0 && Object.keys(req.body).length > 0) {
         // Request body had keys, but none matched updatable fields after validation
        return res.status(400).json({ message: 'No valid fields provided for update.'});
    }
     if (Object.keys(settingsToSave).length === 0 && Object.keys(req.body).length === 0) {
         // Empty request body
        const currentSettings = await SettingsService.getInvoiceSettings(userId);
        return res.status(200).json(currentSettings); // Or 400 if empty update is not allowed
    }

    const savedSettings = await SettingsService.saveInvoiceSettings(userId, settingsToSave);
    res.status(200).json(savedSettings);
  } catch (error) {
    next(error);
  }
};

// --- General Settings Handlers (Per-User) ---
export const getGeneralSettingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId = req.headers['x-user-id'] as string;
    if (!userId && req.query && req.query.userId) {
      userId = req.query.userId as string;
    }
    if (!userId) {
      return res.status(401).json({ message: 'User ID not provided in X-User-ID header or query parameter.' });
    }
    const settings = await getGeneralSettings(userId);
    if (settings) {
      res.status(200).json(settings);
    } else {
      res.status(404).json({ message: 'General settings not found for this user.' });
    }
  } catch (error) {
    next(error);
  }
};

export const saveGeneralSettingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId = req.headers['x-user-id'] as string;
    if (!userId && req.query && req.query.userId) {
      userId = req.query.userId as string;
    }
    if (!userId) {
      return res.status(401).json({ message: 'User ID not provided in X-User-ID header or query parameter.' });
    }
    const updated = await saveGeneralSettings(userId, req.body);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// --- Coupling Bol Handlers (Per-User) ---
export const getCouplingBolHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId = req.headers['x-user-id'] as string;
    if (!userId && req.query && req.query.userId) {
      userId = req.query.userId as string;
    }
    if (!userId) {
      return res.status(401).json({ message: 'User ID not provided in X-User-ID header or query parameter.' });
    }
    const details = await SettingsService.getAccountDetailsByUserId(userId);
    if (details) {
      res.status(200).json(details);
    } else {
      res.status(404).json({ message: 'Coupling Bol details not found for this user.' });
    }
  } catch (error) {
    next(error);
  }
};

export const saveCouplingBolHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId = req.headers['x-user-id'] as string;
    if (!userId && req.query && req.query.userId) {
      userId = req.query.userId as string;
    }
    if (!userId) {
      return res.status(401).json({ message: 'User ID not provided in X-User-ID header or query parameter.' });
    }
    const updated = await SettingsService.saveAccountDetails(userId, req.body);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const getOnboardingStatusHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ message: 'User ID not provided in X-User-ID header.' });
    }
    const status = await SettingsService.getOnboardingStatus(userId);
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

export const updateOnboardingStepHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ message: 'User ID not provided in X-User-ID header.' });
    }
    const updates: Partial<Omit<IUserOnboardingStatus, 'userId' | 'createdAt' | 'updatedAt'>> = {};
    const { hasConfiguredBolApi, hasCompletedShopSync, hasCompletedInvoiceSetup } = req.body;
    if (typeof hasConfiguredBolApi === 'boolean') updates.hasConfiguredBolApi = hasConfiguredBolApi;
    if (typeof hasCompletedShopSync === 'boolean') updates.hasCompletedShopSync = hasCompletedShopSync;
    if (typeof hasCompletedInvoiceSetup === 'boolean') updates.hasCompletedInvoiceSetup = hasCompletedInvoiceSetup;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid onboarding step data provided in the request body.' });
    }
    const updatedStatus = await SettingsService.updateOnboardingStatus(userId, updates);
    res.status(200).json(updatedStatus);
  } catch (error) {
    next(error);
  }
};
