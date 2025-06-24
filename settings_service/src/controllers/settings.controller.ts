import { Request, Response, NextFunction } from 'express';
import * as SettingsService from '../services/settings.service';
import { IAccountDetails, IVatSetting, IInvoiceSettings } from '../models/settings.model';

// --- Account Details Handlers ---
export const getAccountDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const details = await SettingsService.getAccountDetails();
    if (details) {
      // For security, don't send clientSecret unless explicitly requested & authorized
      // For now, sending all, but this is a security note.
      // Consider redacting clientSecret: const { bolClientSecret, ...safeDetails } = details;
      res.status(200).json(details);
    } else {
      // This state (null) should ideally be handled by service creating a default row.
      res.status(404).json({ message: 'Account details not found or initialized.' });
    }
  } catch (error) {
    next(error);
  }
};

export const saveAccountDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bolClientId, bolClientSecret } = req.body;
    // Basic validation: allow null to clear values, but at least one must be provided if not clearing.
    // The service layer handles empty updates gracefully.
    if (bolClientId === undefined && bolClientSecret === undefined) {
         // If body is empty or contains unrelated fields.
        return res.status(400).json({ message: 'Request body must contain at least one of: bolClientId, bolClientSecret.' });
    }

    const detailsToSave: Partial<Omit<IAccountDetails, 'id' | 'createdAt' | 'updatedAt'>> = {};
    if (bolClientId !== undefined) detailsToSave.bolClientId = bolClientId; // Can be null
    if (bolClientSecret !== undefined) detailsToSave.bolClientSecret = bolClientSecret; // Can be null

    const savedDetails = await SettingsService.saveAccountDetails(detailsToSave);
    // Consider redacting clientSecret: const { bolClientSecret: _, ...safeDetails } = savedDetails;
    res.status(200).json(savedDetails);
  } catch (error) {
    next(error);
  }
};

// --- VAT Settings Handlers ---
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
    const settings = await SettingsService.getInvoiceSettings();
     if (settings) {
      res.status(200).json(settings);
    } else {
      res.status(404).json({ message: 'Invoice settings not found or initialized.' });
    }
  } catch (error) {
    next(error);
  }
};

export const saveInvoiceSettingsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyName, companyAddress, vatNumber, defaultInvoiceNotes, invoicePrefix, nextInvoiceNumber } = req.body;
    const settingsToSave: Partial<Omit<IInvoiceSettings, 'id' | 'createdAt' | 'updatedAt'>> = {};

    if(companyName !== undefined) settingsToSave.companyName = companyName; // Allow null/empty string to clear
    if(companyAddress !== undefined) settingsToSave.companyAddress = companyAddress;
    if(vatNumber !== undefined) settingsToSave.vatNumber = vatNumber;
    if(defaultInvoiceNotes !== undefined) settingsToSave.defaultInvoiceNotes = defaultInvoiceNotes;
    if(invoicePrefix !== undefined) settingsToSave.invoicePrefix = invoicePrefix;
    if(nextInvoiceNumber !== undefined) {
        const num = Number(nextInvoiceNumber);
        if (isNaN(num) || num < 0) return res.status(400).json({message: "nextInvoiceNumber must be a non-negative number."});
        settingsToSave.nextInvoiceNumber = num;
    }

    if (Object.keys(settingsToSave).length === 0 && Object.keys(req.body).length > 0) {
         // Request body had keys, but none matched updatable fields after validation
        return res.status(400).json({ message: 'No valid fields provided for update.'});
    }
     if (Object.keys(settingsToSave).length === 0 && Object.keys(req.body).length === 0) {
         // Empty request body
        const currentSettings = await SettingsService.getInvoiceSettings();
        return res.status(200).json(currentSettings); // Or 400 if empty update is not allowed
    }


    const savedSettings = await SettingsService.saveInvoiceSettings(settingsToSave);
    res.status(200).json(savedSettings);
  } catch (error) {
    next(error);
  }
};
