import { Pool } from 'pg';
import { getDBPool } from '../utils/db';

// Base Invoice Item structure - for creation
export interface InvoiceItemBase {
    bol_product_id?: string;
    product_title: string;
    sku?: string;
    quantity: number;
    unit_price: number; // Price per unit, exclusive of tax
    vat_rate: number; // VAT rate as a percentage, e.g., 21 for 21%
    tax_amount_per_unit: number; // Calculated: unit_price * (vat_rate / 100)
    total_price_exclusive_tax: number; // Calculated: unit_price * quantity
    total_tax_amount: number; // Calculated: tax_amount_per_unit * quantity
    total_price_inclusive_tax: number;
    notes?: string;
}

// Full Invoice Item structure - includes DB-generated fields
export interface InvoiceItem extends InvoiceItemBase {
    id: number;
    invoice_id: number;
    created_at: Date;
    updated_at: Date;
}

// Base Invoice structure - for creation
export interface InvoiceBase {
    shop_id: number;
    order_id: string;
    bol_order_id?: string;
    customer_name?: string;
    customer_email?: string;
    billing_address?: any; // JSONB
    shipping_address?: any; // JSONB
    invoice_number: string;
    invoice_date?: Date | string;
    due_date?: Date | string;
    subtotal_amount: number; // Should be stored as cents or Decimal
    tax_amount?: number;
    discount_amount?: number;
    total_amount: number;
    currency?: string;
    status?: string; // 'draft', 'sent', 'paid', 'overdue', 'cancelled', 'void'
    payment_method?: string;
    notes?: string;
    bol_order_data?: any; // JSONB
    pdf_url?: string;
    items: InvoiceItemBase[]; // Array of invoice items for creation
}

// Full Invoice structure - includes DB-generated fields and populated items
export interface Invoice extends Omit<InvoiceBase, 'items'> {
    id: number;
    created_at: Date;
    updated_at: Date;
    items?: InvoiceItem[]; // Items are typically fetched separately or joined

    // Fields for Bol.com upload tracking
    bol_invoice_upload_status?: string | null;
    bol_invoice_uploaded_at?: Date | null;
    bol_invoice_upload_details?: string | null;
}

// --- Invoice Model Functions ---

/**
 * Creates a new invoice and its items in the database.
 * This should be done within a transaction.
 */
export const createInvoice = async (invoiceData: InvoiceBase): Promise<Invoice> => {
    const pool = getDBPool();
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const invoiceRes = await client.query(
            `INSERT INTO invoices (
                shop_id, order_id, bol_order_id, customer_name, customer_email, billing_address, shipping_address,
                invoice_number, invoice_date, due_date, subtotal_amount, tax_amount, discount_amount, total_amount,
                currency, status, payment_method, notes, bol_order_data, pdf_url
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
            ) RETURNING *`,
            [
                invoiceData.shop_id, invoiceData.order_id, invoiceData.bol_order_id, invoiceData.customer_name,
                invoiceData.customer_email, invoiceData.billing_address, invoiceData.shipping_address,
                invoiceData.invoice_number, invoiceData.invoice_date || new Date(), invoiceData.due_date,
                invoiceData.subtotal_amount, invoiceData.tax_amount, invoiceData.discount_amount, invoiceData.total_amount,
                invoiceData.currency || 'EUR', invoiceData.status || 'draft', invoiceData.payment_method,
                invoiceData.notes, invoiceData.bol_order_data, invoiceData.pdf_url
            ]
        );
        const newInvoice: Invoice = invoiceRes.rows[0];
        const createdItems: InvoiceItem[] = [];

        if (invoiceData.items && invoiceData.items.length > 0) {
            for (const item of invoiceData.items) {
                // Ensure all necessary fields are present, falling back to calculations if service layer didn't provide them
                // However, for this iteration, we assume service layer calculates and provides all item fields.
                const itemRes = await client.query(
                    `INSERT INTO invoice_items (
                        invoice_id, bol_product_id, product_title, sku, quantity, unit_price,
                        tax_rate, tax_amount_per_unit, total_price_exclusive_tax, total_tax_amount, total_price_inclusive_tax, notes
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
                    ) RETURNING *`,
                    [
                        newInvoice.id, item.bol_product_id, item.product_title, item.sku, item.quantity, item.unit_price,
                        item.vat_rate, // mapped to tax_rate column in DB
                        item.tax_amount_per_unit,
                        item.total_price_exclusive_tax,
                        item.total_tax_amount,
                        item.total_price_inclusive_tax,
                        item.notes
                    ]
                );
                createdItems.push(itemRes.rows[0]);
            }
        }
        newInvoice.items = createdItems;

        await client.query('COMMIT');
        return newInvoice;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating invoice in model:', error);
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Retrieves an invoice by its ID, optionally including its items.
 */
export const getInvoiceById = async (id: number, includeItems: boolean = true): Promise<Invoice | null> => {
    const pool = getDBPool();
    const invoiceRes = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);

    if (invoiceRes.rows.length === 0) {
        return null;
    }
    const invoice: Invoice = invoiceRes.rows[0];

    if (includeItems) {
        const itemsRes = await pool.query('SELECT * FROM invoice_items WHERE invoice_id = $1 ORDER BY id ASC', [id]);
        invoice.items = itemsRes.rows;
    }
    return invoice;
};

/**
 * Lists invoices with basic filtering and pagination.
 */
export interface ListInvoicesFilters {
    shop_id?: number;
    status?: string;
    customer_email?: string;
    date_from?: string; // YYYY-MM-DD
    date_to?: string;   // YYYY-MM-DD
}
export interface PaginationOptions {
    limit?: number;
    offset?: number;
}

export const listInvoices = async (filters: ListInvoicesFilters = {}, pagination: PaginationOptions = {}): Promise<Invoice[]> => {
    const pool = getDBPool();
    let query = 'SELECT * FROM invoices';
    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (filters.shop_id) {
        conditions.push(`shop_id = $${paramCount++}`);
        values.push(filters.shop_id);
    }
    if (filters.status) {
        conditions.push(`status = $${paramCount++}`);
        values.push(filters.status);
    }
    if (filters.customer_email) {
        conditions.push(`customer_email ILIKE $${paramCount++}`);
        values.push(`%${filters.customer_email}%`);
    }
    if (filters.date_from) {
        conditions.push(`invoice_date >= $${paramCount++}`);
        values.push(filters.date_from);
    }
    if (filters.date_to) {
        conditions.push(`invoice_date <= $${paramCount++}`);
        values.push(filters.date_to);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY invoice_date DESC, id DESC'; // Default ordering

    if (pagination.limit) {
        query += ` LIMIT $${paramCount++}`;
        values.push(pagination.limit);
    }
    if (pagination.offset) {
        query += ` OFFSET $${paramCount++}`;
        values.push(pagination.offset);
    }

    const result = await pool.query(query, values);
    // Note: This doesn't fetch items for each invoice to avoid N+1.
    // Items should be fetched separately if needed for a list view or when viewing a single invoice.
    return result.rows;
};


/**
 * Updates an invoice's status or other mutable fields.
 */
export const updateInvoiceStatus = async (id: number, status: string): Promise<Invoice | null> => {
    const pool = getDBPool();
    // Add more fields to update as needed, e.g., notes, pdf_url
    const result = await pool.query(
        'UPDATE invoices SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [status, id]
    );
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
};

/**
 * Updates the Bol.com upload status information for a given invoice.
 */
export const updateInvoiceBolUploadInfo = async (
    invoiceId: number,
    status: string,
    uploadedAt?: Date | null,
    details?: string | null
): Promise<Invoice | null> => {
    const pool = getDBPool();
    const updateFields: any = {
        bol_invoice_upload_status: status,
        bol_invoice_upload_details: details,
        updated_at: new Date(), // Always update the main updated_at timestamp
    };
    if (uploadedAt !== undefined) { // Allow explicit null to clear the date
        updateFields.bol_invoice_uploaded_at = uploadedAt;
    }

    const setClauses = Object.keys(updateFields)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(', ');
    const values = Object.values(updateFields);
    values.push(invoiceId); // For the WHERE clause

    const query = `UPDATE invoices SET ${setClauses} WHERE id = $${values.length} RETURNING *`;

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0] as Invoice;
    } catch (error) {
        console.error(`Error updating Bol upload info for invoice ${invoiceId}:`, error);
        throw error;
    }
};


// Add more functions as needed:
// - updateInvoice(id: number, data: Partial<InvoiceBase>): Promise<Invoice | null>
// - deleteInvoice(id: number): Promise<boolean> (soft delete by changing status or hard delete)
// - Functions for managing invoice items if needed separately, though often managed with the invoice.

// Consider using a query builder like Knex.js for more complex queries if preferred.
// For now, sticking to raw SQL with pg.Pool.
// Remember to handle BigInt or Decimal types carefully if amounts are stored that way.
// The current DDL uses DECIMAL, which pg driver should handle as strings or numbers depending on configuration.
// It's safer to work with amounts in cents (integers) throughout the application if possible,
// converting only at display time. This model currently assumes numeric types from pg.
// For production, ensure robust error handling and logging.Tool output for `overwrite_file_with_block`:
