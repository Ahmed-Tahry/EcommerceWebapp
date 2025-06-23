import { Request, Response, NextFunction } from 'express';
import * as SettingsService from '../services/settings.service';
import { IProductVat, IAccountSetting } from '../models/settings.model';

// --- Controller functions for ProductsVat CRUD ---

export const createProductVatHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productVatData: IProductVat = req.body;
    // Basic validation (more can be added with a library like Joi or Zod)
    if (!productVatData.productId || !productVatData.ean || !productVatData.productName || productVatData.vatRate === undefined || !productVatData.countryCode) {
      res.status(400).json({ message: 'Missing required fields: productId, ean, productName, vatRate, countryCode' });
      return;
    }
    const newProductVat = await SettingsService.createProductVat(productVatData);
    res.status(201).json(newProductVat);
  } catch (error) {
    next(error);
  }
};

export const getProductVatByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const productVat = await SettingsService.getProductVatById(productId);
    if (productVat) {
      res.status(200).json(productVat);
    } else {
      res.status(404).json({ message: `Product VAT with ID ${productId} not found` });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllProductsVatHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productsVat = await SettingsService.getAllProductsVat();
    res.status(200).json(productsVat);
  } catch (error) {
    next(error);
  }
};

export const updateProductVatHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const updateData: Partial<IProductVat> = req.body;

    if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: 'No update data provided.' });
        return;
    }
    // Prevent primary key from being changed in body if passed
    if (updateData.productId && updateData.productId !== productId) {
        res.status(400).json({ message: 'Product ID in body does not match ID in path and cannot be changed.' });
        return;
    }
    delete updateData.productId; // Ensure it's not part of the update payload sent to service

    const updatedProductVat = await SettingsService.updateProductVat(productId, updateData);
    if (updatedProductVat) {
      res.status(200).json(updatedProductVat);
    } else {
      res.status(404).json({ message: `Product VAT with ID ${productId} not found or no changes made.` });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteProductVatHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;
    const success = await SettingsService.deleteProductVat(productId);
    if (success) {
      res.status(200).json({ message: `Product VAT with ID ${productId} deleted successfully` });
      // Alt: res.status(204).send();
    } else {
      res.status(404).json({ message: `Product VAT with ID ${productId} not found or could not be deleted` });
    }
  } catch (error) {
    next(error);
  }
};

// --- Controller functions for AccountSettings CRUD ---

export const createAccountSettingHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const accountSettingData: IAccountSetting = req.body;
    // Basic validation
    if (!accountSettingData.accountId || !accountSettingData.accountName || !accountSettingData.countryCode) {
      res.status(400).json({ message: 'Missing required fields: accountId, accountName, countryCode' });
      return;
    }
    const newAccountSetting = await SettingsService.createAccountSetting(accountSettingData);
    res.status(201).json(newAccountSetting);
  } catch (error) {
    next(error);
  }
};

export const getAccountSettingByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accountId } = req.params;
    const accountSetting = await SettingsService.getAccountSettingById(accountId);
    if (accountSetting) {
      res.status(200).json(accountSetting);
    } else {
      res.status(404).json({ message: `Account Setting with ID ${accountId} not found` });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllAccountSettingsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const accountSettings = await SettingsService.getAllAccountSettings();
    res.status(200).json(accountSettings);
  } catch (error) {
    next(error);
  }
};

export const updateAccountSettingHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accountId } = req.params;
    const updateData: Partial<IAccountSetting> = req.body;

    if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: 'No update data provided.' });
        return;
    }
    if (updateData.accountId && updateData.accountId !== accountId) {
        res.status(400).json({ message: 'Account ID in body does not match ID in path and cannot be changed.' });
        return;
    }
    delete updateData.accountId;

    const updatedAccountSetting = await SettingsService.updateAccountSetting(accountId, updateData);
    if (updatedAccountSetting) {
      res.status(200).json(updatedAccountSetting);
    } else {
      res.status(404).json({ message: `Account Setting with ID ${accountId} not found or no changes made.` });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteAccountSettingHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accountId } = req.params;
    const success = await SettingsService.deleteAccountSetting(accountId);
    if (success) {
      res.status(200).json({ message: `Account Setting with ID ${accountId} deleted successfully` });
      // Alt: res.status(204).send();
    } else {
      res.status(404).json({ message: `Account Setting with ID ${accountId} not found or could not be deleted` });
    }
  } catch (error) {
    next(error);
  }
};
