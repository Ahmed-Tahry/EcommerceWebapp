import { Router } from 'express';
import *  as InvoiceController from '../controllers/invoice.controller';

const router = Router();

// --- Invoice API Routes ---

// POST /api/invoices - Create a new invoice
router.post('/', InvoiceController.handleCreateInvoice);

// GET /api/invoices - List invoices with filtering and pagination
router.get('/', InvoiceController.handleListInvoices);

// GET /api/invoices/:id - Get a specific invoice by ID
router.get('/:id', InvoiceController.handleGetInvoiceById);

// PUT /api/invoices/:id/status - Update an invoice's status (can be PATCH too)
// Or a more general update: PUT /api/invoices/:id
router.put('/:id/status', InvoiceController.handleUpdateInvoiceStatus);
// Example for a general update (if you implement handleUpdateInvoice controller)
// router.put('/:id', InvoiceController.handleUpdateInvoice);


// DELETE /api/invoices/:id - Delete/cancel an invoice (placeholder)
// router.delete('/:id', InvoiceController.handleDeleteInvoice);


// GET /api/invoices/:id/pdf - Generate/retrieve PDF for an invoice
router.get('/:id/pdf', InvoiceController.handleGetInvoicePdf);

// POST /api/invoices/trigger-from-order - Internal endpoint for shop_service to trigger invoice creation
router.post('/trigger-from-order', InvoiceController.handleTriggerInvoiceFromOrder);


export default router;
