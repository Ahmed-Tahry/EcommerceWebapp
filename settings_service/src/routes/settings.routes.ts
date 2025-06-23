import { Router } from 'express';
import {
    createProductVatHandler,
    getProductVatByIdHandler,
    getAllProductsVatHandler,
    updateProductVatHandler,
    deleteProductVatHandler,
    createAccountSettingHandler,
    getAccountSettingByIdHandler,
    getAllAccountSettingsHandler,
    updateAccountSettingHandler,
    deleteAccountSettingHandler
} from '../controllers/settings.controller';

const router = Router();

// --- Routes for ProductsVat CRUD ---
router.post('/products-vat', createProductVatHandler);
router.get('/products-vat', getAllProductsVatHandler);
router.get('/products-vat/:productId', getProductVatByIdHandler);
router.put('/products-vat/:productId', updateProductVatHandler);
router.delete('/products-vat/:productId', deleteProductVatHandler);

// --- Routes for AccountSettings CRUD ---
router.post('/account-settings', createAccountSettingHandler);
router.get('/account-settings', getAllAccountSettingsHandler);
router.get('/account-settings/:accountId', getAccountSettingByIdHandler);
router.put('/account-settings/:accountId', updateAccountSettingHandler);
router.delete('/account-settings/:accountId', deleteAccountSettingHandler);

export default router;
