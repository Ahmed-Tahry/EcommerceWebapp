import { Router } from 'express';
import * as InternalController from '../controllers/internal.controller';

const router = Router();

// Route to get VAT information for a list of product IDs
// It will be mounted under /internal/api, so the full path might be /internal/api/products/vat-info
router.get('/products/vat-info', InternalController.handleGetProductsVatInfo);

// Route for invoice_service to trigger upload of an invoice PDF to Bol.com via shop_service
router.post('/orders/:orderId/upload-invoice', InternalController.handleUploadInvoiceOrder);

export default router;
