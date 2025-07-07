import * as InvoiceModel from '../models/invoice.model';
import { InvoiceBase, Invoice, ListInvoicesFilters, PaginationOptions } from '../models/invoice.model';

// --- Invoice Service Functions ---

/**
 * Generates a unique invoice number.
 * Placeholder logic: Implement a robust sequential or patterned invoice number generator.
 * This might involve querying the last invoice number for a shop_id and incrementing it.
 */
const generateInvoiceNumber = async (shopId: number): Promise<string> => {
    // Example: INV-SHOPID-TIMESTAMP-RANDOM
    // For a real system, this needs to be robust and ensure uniqueness, possibly DB sequence or a dedicated service.
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    // A more robust approach would be to fetch the last invoice number for the shop and increment.
    // const lastInvoice = await InvoiceModel.getLastInvoiceByShop(shopId);
    // if (lastInvoice) { ... increment logic ... }
    return `INV-${shopId}-${timestamp}-${randomSuffix}`;
};

/**
 * Creates a new invoice.
 */
import axios from 'axios';
import config from '../config/config'; // To potentially get shop_service URL

// Define the expected structure of an item coming into the service
// It will have product_id (e.g., bol_product_id) but not VAT rate yet.
interface InputInvoiceItem extends Omit<InvoiceModel.InvoiceItemBase, 'vat_rate' | 'tax_amount_per_unit' | 'total_price_exclusive_tax' | 'total_tax_amount' | 'total_price_inclusive_tax'> {
    bol_product_id: string; // Or a generic product_id
    // unit_price, quantity, product_title etc. are inherited
}

// Define the expected input structure for creating a new invoice at the service level
interface CreateInvoiceServiceInput extends Omit<InvoiceBase, 'invoice_number' | 'subtotal_amount' | 'tax_amount' | 'total_amount' | 'items'> {
    shop_id: number;
    items: InputInvoiceItem[];
}

// Define the expected response structure from shop_service for VAT info
interface ProductVatInfo {
    id: string; // Matches bol_product_id
    vat_rate: number;
    // other product details if needed by invoice service, e.g., updated product_title
}

export const createNewInvoice = async (
    invoiceInput: CreateInvoiceServiceInput
): Promise<Invoice> => {

    // TODO: Add validation logic here (e.g., using Joi or Zod) for invoiceInput

    // 1. Collect all unique product IDs from the input items
    const productIds = [...new Set(invoiceInput.items.map(item => item.bol_product_id))];

    // 2. Fetch VAT rates from shop_service
    let productVatData: Record<string, { vat_rate: number }> = {};
    if (productIds.length > 0) {
        try {
            // Construct the URL for shop_service. This should ideally come from config.
            const shopServiceUrl = config.shopServiceUrl || 'http://shop_service:3000'; // Default if not in config
            const response = await axios.get<{ products: ProductVatInfo[] }>(
                `${shopServiceUrl}/internal/api/products/vat-info?product_ids=${productIds.join(',')}`
            );
            // Assuming shop_service returns data in format: { products: [{id: "id1", vat_rate: 21}, ...] }
            response.data.products.forEach(p => {
                productVatData[p.id] = { vat_rate: p.vat_rate };
            });
        } catch (error) {
            console.error('Error fetching VAT rates from shop_service:', error);
            // Decide error handling: throw, or proceed with default VAT/log warning?
            // For now, let's throw an error if shop_service is unavailable or product VAT is missing.
            throw new Error('Failed to fetch VAT information for products from shop_service.');
        }
    }

    let calculatedSubtotal = 0;
    let calculatedTotalTax = 0;

    const processedItems: InvoiceModel.InvoiceItemBase[] = invoiceInput.items.map(item => {
        const vatInfo = productVatData[item.bol_product_id];
        if (!vatInfo || typeof vatInfo.vat_rate !== 'number') {
            // Handle missing VAT info for a product
            console.warn(`VAT rate for product ID ${item.bol_product_id} not found or invalid. Using 0%.`);
            // Decide: throw error, or use a default (e.g., 0 or a configured default)
            // For now, using 0 to allow invoice creation but this needs business decision.
            vatInfo.vat_rate = 0;
        }

        if (typeof item.unit_price !== 'number' || typeof item.quantity !== 'number') {
            throw new Error('Invalid item data: unit_price and quantity must be numbers.');
        }

        const vatRate = vatInfo.vat_rate;
        const taxAmountPerUnit = parseFloat((item.unit_price * (vatRate / 100)).toFixed(2));
        const totalPriceExclusiveTax = parseFloat((item.unit_price * item.quantity).toFixed(2));
        const totalTaxAmount = parseFloat((taxAmountPerUnit * item.quantity).toFixed(2));
        const totalPriceInclusiveTax = parseFloat((totalPriceExclusiveTax + totalTaxAmount).toFixed(2));

        calculatedSubtotal += totalPriceExclusiveTax;
        calculatedTotalTax += totalTaxAmount;

        return {
            ...item, // bol_product_id, product_title, sku, quantity, unit_price, notes
            vat_rate: vatRate,
            tax_amount_per_unit: taxAmountPerUnit,
            total_price_exclusive_tax: totalPriceExclusiveTax,
            total_tax_amount: totalTaxAmount,
            total_price_inclusive_tax: totalPriceInclusiveTax,
        };
    });

    const discountAmount = parseFloat((invoiceInput.discount_amount || 0).toFixed(2));
    calculatedSubtotal = parseFloat(calculatedSubtotal.toFixed(2));
    calculatedTotalTax = parseFloat(calculatedTotalTax.toFixed(2));
    const calculatedTotalAmount = parseFloat((calculatedSubtotal + calculatedTotalTax - discountAmount).toFixed(2));

    // 1. Generate a unique invoice number
    const invoiceNumber = await generateInvoiceNumber(invoiceInput.shop_id);

    // 2. Prepare full invoice data
    const fullInvoiceData: InvoiceBase = {
        ...invoiceInput,
        items: processedItems,
        invoice_number: invoiceNumber,
        subtotal_amount: calculatedSubtotal,
        tax_amount: calculatedTotalTax,
        discount_amount: discountAmount,
        total_amount: calculatedTotalAmount,
        status: invoiceInput.status || 'draft', // Default status
    };

    // 3. Call the model function to create the invoice
    try {
        const createdInvoice = await InvoiceModel.createInvoice(fullInvoiceData);
        return createdInvoice;
    } catch (error) {
        console.error('Error in service creating invoice:', error);
        // Handle specific errors or re-throw
        throw error;
    }
};

// This interface should match the one in the controller.
// Consider moving shared DTOs to a common types directory if they grow complex or are used by more services.
interface RawOrderPayloadItem {
    bol_product_id: string;
    product_title: string;
    quantity: number;
    unit_price: number;
    sku?: string; // Optional, if provided by shop_service
    // any other item-specific fields from shop_service
}
interface RawOrderPayload {
    shop_id: number;
    order_id: string;
    customer_name?: string;
    customer_email?: string;
    billing_address?: any;
    shipping_address?: any;
    order_date?: string | Date;
    currency?: string;
    items: RawOrderPayloadItem[];
    discount_amount?: number;
    notes?: string;
    payment_method?: string;
    bol_order_data?: any;
}

/**
 * Processes raw order data (presumably from shop_service) and creates an invoice.
 */
export const createInvoiceFromOrderData = async (orderData: RawOrderPayload): Promise<Invoice> => {
    // Transform RawOrderPayload items into the structure expected by createNewInvoice's items
    // createNewInvoice expects items to be of type InputInvoiceItem, which is:
    // Omit<InvoiceModel.InvoiceItemBase, 'vat_rate' | 'tax_amount_per_unit' | 'total_price_exclusive_tax' | 'total_tax_amount' | 'total_price_inclusive_tax'>
    // & { bol_product_id: string; }
    // This means it needs: bol_product_id, product_title, sku?, quantity, unit_price, notes?

    const serviceInputItems: InputInvoiceItem[] = orderData.items.map(rawItem => ({
        bol_product_id: rawItem.bol_product_id,
        product_title: rawItem.product_title,
        quantity: rawItem.quantity,
        unit_price: rawItem.unit_price,
        sku: rawItem.sku, // Pass along if present
        // notes for item could be added if shop_service provides them
    }));

    const invoiceInput: CreateInvoiceServiceInput = {
        shop_id: orderData.shop_id,
        order_id: orderData.order_id, // This is Bol.com order ID
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        billing_address: orderData.billing_address,
        shipping_address: orderData.shipping_address,
        invoice_date: orderData.order_date ? new Date(orderData.order_date) : new Date(), // Use order_date as invoice_date
        // due_date can be set based on payment terms later or passed if known
        currency: orderData.currency || 'EUR',
        items: serviceInputItems,
        discount_amount: orderData.discount_amount,
        notes: orderData.notes, // Overall invoice notes
        payment_method: orderData.payment_method,
        bol_order_data: orderData.bol_order_data, // Store raw Bol order data if provided
        // status will default to 'draft' in createNewInvoice if not set here
    };

    try {
        const createdInvoice = await createNewInvoice(invoiceInput);
        // Potentially, after successful creation, trigger PDF storage or other post-creation actions
        // For now, just return the created invoice.
        return createdInvoice;
    } catch (error) {
        console.error(`Error in service creating invoice from order data for order ${orderData.order_id}:`, error);
        // Re-throw to be handled by the controller, which might return a specific error to shop_service
        throw error;
    }
};

/**
 * Retrieves an invoice by its ID.
 */
export const getInvoiceDetails = async (id: number, includeItems: boolean = true): Promise<Invoice | null> => {
    try {
        const invoice = await InvoiceModel.getInvoiceById(id, includeItems);
        if (!invoice) {
            // Handle not found case, maybe throw a custom error
            return null;
        }
        // Potentially transform data or add related info here if needed
        return invoice;
    } catch (error) {
        console.error(`Error in service fetching invoice ${id}:`, error);
        throw error;
    }
};

/**
 * Lists invoices with filtering and pagination.
 */
export const getAllInvoices = async (filters: ListInvoicesFilters = {}, pagination: PaginationOptions = {}): Promise<Invoice[]> => {
    try {
        // Add any business logic for default filters or pagination limits if necessary
        const invoices = await InvoiceModel.listInvoices(filters, pagination);
        return invoices;
    } catch (error) {
        console.error('Error in service listing invoices:', error);
        throw error;
    }
};

/**
 * Updates an invoice's status.
 */
export const changeInvoiceStatus = async (id: number, status: string): Promise<Invoice | null> => {
    // TODO: Add validation for allowed status transitions
    // For example, an invoice that is 'paid' cannot go back to 'draft' without specific logic.
    // Or a 'void' invoice cannot be 'paid'.
    const validStatuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled', 'void'];
    if (!validStatuses.includes(status)) {
        throw new Error(`Invalid invoice status: ${status}`);
    }

    try {
        const updatedInvoice = await InvoiceModel.updateInvoiceStatus(id, status);
        if (!updatedInvoice) {
            // Handle not found
            return null;
        }
        // Potentially trigger side effects, like sending an email when status changes to 'sent' or 'paid'
        // (This would involve calling an EmailService in the future)
        return updatedInvoice;
    } catch (error) {
        console.error(`Error in service updating status for invoice ${id}:`, error);
        throw error;
    }
};


// Placeholder for a more comprehensive update function
// export const updateExistingInvoice = async (id: number, updateData: Partial<Omit<InvoiceBase, 'items' | 'invoice_number'>>) => {
//     // Logic to fetch invoice, validate changes, update allowed fields, save.
//     // Items update would likely be a separate, more complex operation or handled carefully.
// };

// Placeholder for delete function
// export const deleteInvoiceById = async (id: number) => {
//     // Logic for soft delete (e.g., change status to 'cancelled' or 'void') or hard delete.
// };

import * as PdfGenerator from '../utils/pdfGenerator';

/**
 * Fetches an invoice and generates its PDF representation as a Buffer.
 */
export const getInvoicePdfBuffer = async (invoiceId: number): Promise<Buffer | null> => {
    const invoice = await getInvoiceDetails(invoiceId, true); // Ensure items are included
    if (!invoice) {
        // Or throw a NotFoundError
        return null;
    }

    try {
        const templateHtml = await PdfGenerator.getInvoiceTemplateHtml();
        const populatedHtml = PdfGenerator.populateInvoiceTemplate(invoice, templateHtml);
        const pdfBuffer = await PdfGenerator.generatePdfFromHtml(populatedHtml);
        return pdfBuffer;
    } catch (error) {
        console.error(`Error generating PDF for invoice ${invoiceId}:`, error);
        // Depending on desired behavior, re-throw or return null/custom error
        throw new Error(`Failed to generate PDF for invoice ${invoiceId}.`);
    }
};
