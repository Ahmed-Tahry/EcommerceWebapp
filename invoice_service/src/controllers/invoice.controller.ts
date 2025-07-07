import { Request, Response, NextFunction } from 'express';
import * as InvoiceService from '../services/invoice.service';
import { InvoiceBase, ListInvoicesFilters, PaginationOptions } from '../models/invoice.model';

// --- Invoice Controller Functions ---

export const handleCreateInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Input validation for req.body (e.g., using Joi, Zod, or express-validator)
        // For now, assuming shop_id is part of the payload or derived from auth middleware later.
        // If shop_id comes from auth (e.g. req.user.shopId), adjust accordingly.
        const invoiceData: Omit<InvoiceBase, 'invoice_number'> & { shop_id: number } = req.body;

        if (!invoiceData.shop_id) {
            return res.status(400).json({ message: "shop_id is required." });
        }
        // Add more validation as needed (e.g. for items structure, total_amount etc.)

        const newInvoice = await InvoiceService.createNewInvoice(invoiceData);
        res.status(201).json(newInvoice);
    } catch (error) {
        console.error('Controller error creating invoice:', error);
        // Pass to a generic error handler middleware
        next(error);
    }
};

export const handleGetInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid invoice ID format.' });
        }
        const includeItems = req.query.includeItems !== 'false'; // Default true

        const invoice = await InvoiceService.getInvoiceDetails(id, includeItems);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }
        res.status(200).json(invoice);
    } catch (error) {
        console.error('Controller error getting invoice by ID:', error);
        next(error);
    }
};

export const handleListInvoices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Validate query parameters
        const filters: ListInvoicesFilters = {
            shop_id: req.query.shop_id ? parseInt(req.query.shop_id as string, 10) : undefined,
            status: req.query.status as string | undefined,
            customer_email: req.query.customer_email as string | undefined,
            date_from: req.query.date_from as string | undefined,
            date_to: req.query.date_to as string | undefined,
        };
        const pagination: PaginationOptions = {
            limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
            offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
        };

        // Remove undefined filters to avoid issues with model query
        Object.keys(filters).forEach(key => filters[key as keyof ListInvoicesFilters] === undefined && delete filters[key as keyof ListInvoicesFilters]);


        const invoices = await InvoiceService.getAllInvoices(filters, pagination);
        // TODO: Add pagination info to response (total count, current page, etc.)
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Controller error listing invoices:', error);
        next(error);
    }
};

export const handleUpdateInvoiceStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { status } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid invoice ID format.' });
        }
        if (!status || typeof status !== 'string') {
            return res.status(400).json({ message: 'Invalid or missing status in request body.' });
        }

        const updatedInvoice = await InvoiceService.changeInvoiceStatus(id, status);
        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found or status update failed.' });
        }
        res.status(200).json(updatedInvoice);
    } catch (error) {
        console.error('Controller error updating invoice status:', error);
        if (error instanceof Error && error.message.startsWith('Invalid invoice status')) {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};


// Placeholder for other handlers:
// - handleUpdateInvoice (for more general updates)
// - handleDeleteInvoice

export const handleGetInvoicePdf = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid invoice ID format.' });
        }

        const pdfBuffer = await InvoiceService.getInvoicePdfBuffer(id);

        if (!pdfBuffer) {
            return res.status(404).json({ message: 'Invoice not found or PDF could not be generated.' });
        }

        // Fetch invoice details again just for the invoice number for the filename (or pass it from service)
        const invoiceDetails = await InvoiceService.getInvoiceDetails(id, false);
        const filename = invoiceDetails ? `invoice-${invoiceDetails.invoice_number}.pdf` : `invoice-${id}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`); // or 'attachment' to force download
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Controller error generating invoice PDF:', error);
        next(error);
    }
};

// --- Internal Endpoints ---

// Define the expected payload structure from shop_service
// This should be kept in sync with what shop_service sends
interface RawOrderPayloadItem {
    bol_product_id: string;
    product_title: string;
    quantity: number;
    unit_price: number; // Price per unit, exclusive of VAT
    // Potentially other fields like SKU, item-level discounts from shop_service
}
interface RawOrderPayload {
    shop_id: number;
    order_id: string; // Bol.com order ID
    customer_name?: string;
    customer_email?: string;
    billing_address?: any; // JSON or specific structure
    shipping_address?: any; // JSON or specific structure
    order_date?: string | Date; // ISO date string preferably
    currency?: string;
    items: RawOrderPayloadItem[];
    // Potentially order-level discount info
    discount_amount?: number; // Overall order discount
    notes?: string; // Overall order notes
    // Any other fields from Bol.com order that might be relevant for the invoice
    // e.g. payment_method if known by shop_service
    payment_method?: string;
    bol_order_data?: any; // Raw Bol order data if useful to store on invoice
}


export const handleTriggerInvoiceFromOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderPayload: RawOrderPayload = req.body;

        // Basic validation (more robust validation with Zod/Joi is recommended)
        if (!orderPayload || !orderPayload.shop_id || !orderPayload.order_id || !orderPayload.items || orderPayload.items.length === 0) {
            return res.status(400).json({ message: 'Invalid order payload: shop_id, order_id, and at least one item are required.' });
        }
        for (const item of orderPayload.items) {
            if (!item.bol_product_id || typeof item.quantity !== 'number' || typeof item.unit_price !== 'number') {
                return res.status(400).json({ message: 'Invalid item in order payload: bol_product_id, quantity, and unit_price are required for all items.' });
            }
        }

        const createdInvoice = await InvoiceService.createInvoiceFromOrderData(orderPayload);
        res.status(201).json({ message: 'Invoice triggered and created successfully.', invoice: createdInvoice });

    } catch (error) {
        console.error('Controller error triggering invoice from order:', error);
        if (error instanceof Error && error.message.includes('Failed to fetch VAT information')) {
            // Specific error that might be retried or handled differently by shop_service
             return res.status(503).json({ message: 'Error creating invoice: Failed to retrieve product VAT information from shop_service.', details: error.message });
        }
        next(error); // Pass to generic error handler
    }
};


// Example of a more generic error handler (to be defined in middlewares/errorHandler.ts)
// export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error("Unhandled error in API:", err.stack || err);
//     // Respond with a generic server error
//     // Log the error properly for monitoring
//     res.status(500).json({ message: 'An unexpected error occurred on the server.' });
// };
