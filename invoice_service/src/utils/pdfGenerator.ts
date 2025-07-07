import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { Invoice, InvoiceItem } from '../models/invoice.model'; // Assuming Invoice model is defined

// Simple function to format currency (can be expanded)
const formatCurrency = (amount: number | undefined | null, currencySymbol: string = '€'): string => {
    if (amount === undefined || amount === null) return `${currencySymbol}0.00`;
    return `${currencySymbol}${amount.toFixed(2)}`;
};

const formatDate = (date: Date | string | undefined | null): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('nl-NL', { year: 'numeric', month: '2-digit', day: '2-digit' }); // Example: DD-MM-YYYY
}

export const populateInvoiceTemplate = (invoiceData: Invoice, templateHtml: string): string => {
    let populatedHtml = templateHtml;

    // Invoice level data
    populatedHtml = populatedHtml.replace(/{{invoice_number}}/g, invoiceData.invoice_number || '');
    populatedHtml = populatedHtml.replace(/{{invoice_date}}/g, formatDate(invoiceData.invoice_date));
    populatedHtml = populatedHtml.replace(/{{due_date}}/g, formatDate(invoiceData.due_date));
    populatedHtml = populatedHtml.replace(/{{order_id}}/g, invoiceData.order_id || '');
    populatedHtml = populatedHtml.replace(/{{currency}}/g, invoiceData.currency || 'EUR');

    // Customer details (assuming billing_address is an object, adjust if it's just a string)
    populatedHtml = populatedHtml.replace(/{{customer_name}}/g, invoiceData.customer_name || 'N/A');
    if (invoiceData.billing_address && typeof invoiceData.billing_address === 'object') {
        const ba = invoiceData.billing_address as any; // Type assertion
        populatedHtml = populatedHtml.replace(/{{customer_billing_address_line1}}/g, `${ba.street || ''} ${ba.houseNumber || ''}`.trim());
        populatedHtml = populatedHtml.replace(/{{customer_billing_city_zip_country}}/g, `${ba.city || ''} ${ba.zipCode || ''}, ${ba.countryCode || ''}`.trim());
    } else {
        populatedHtml = populatedHtml.replace(/{{customer_billing_address_line1}}/g, invoiceData.billing_address?.toString() || 'N/A');
        populatedHtml = populatedHtml.replace(/{{customer_billing_city_zip_country}}/g, '');
    }
    populatedHtml = populatedHtml.replace(/{{customer_email}}/g, invoiceData.customer_email || '');

    // Seller details (placeholders, these should come from config or shop settings)
    populatedHtml = populatedHtml.replace(/{{seller_name}}/g, 'Your Company Name');
    populatedHtml = populatedHtml.replace(/{{seller_address_line1}}/g, '123 Seller Street');
    populatedHtml = populatedHtml.replace(/{{seller_city_zip_country}}/g, 'Seller Town, 12345, NL');
    populatedHtml = populatedHtml.replace(/{{seller_vat_id}}/g, 'NL123456789B01');


    // Items table
    let itemsHtml = '';
    if (invoiceData.items) {
        invoiceData.items.forEach((item: InvoiceItem, index: number) => {
            itemsHtml += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.product_title}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">${formatCurrency(item.unit_price, invoiceData.currency)}</td>
                    <td class="text-right">${item.vat_rate}%</td>
                    <td class="text-right">${formatCurrency(item.total_price_exclusive_tax, invoiceData.currency)}</td>
                </tr>
            `;
        });
    }
    // This is a naive way to replace a block. A real templating engine is better.
    // Assuming {{#items}} ... {{/items}} is a block to be replaced.
    const itemsRegex = /{{#items}}([\s\S]*?){{\/items}}/;
    populatedHtml = populatedHtml.replace(itemsRegex, itemsHtml);


    // Totals
    populatedHtml = populatedHtml.replace(/{{subtotal_amount_formatted}}/g, formatCurrency(invoiceData.subtotal_amount, invoiceData.currency));
    populatedHtml = populatedHtml.replace(/{{tax_amount_formatted}}/g, formatCurrency(invoiceData.tax_amount, invoiceData.currency));

    if (invoiceData.discount_amount && invoiceData.discount_amount > 0) {
        populatedHtml = populatedHtml.replace(/{{#if discount_amount_positive}}([\s\S]*?){{\/if}}/,
            `<tr><td>Discount:</td><td class="text-right">-${formatCurrency(invoiceData.discount_amount, invoiceData.currency)}</td></tr>`);
    } else {
        populatedHtml = populatedHtml.replace(/{{#if discount_amount_positive}}([\s\S]*?){{\/if}}/, '');
    }

    populatedHtml = populatedHtml.replace(/{{total_amount_formatted}}/g, formatCurrency(invoiceData.total_amount, invoiceData.currency));

    // Notes & Footer
    populatedHtml = populatedHtml.replace(/{{notes}}/g, invoiceData.notes || '');
    populatedHtml = populatedHtml.replace(/{{payment_terms}}/g, 'Payment within 14 days'); // Example, make configurable
    populatedHtml = populatedHtml.replace(/{{bank_details}}/g, 'IBAN: NLxx BANK xxxx xxxx xx'); // Example, make configurable

    return populatedHtml;
};


let browserInstance: Browser | null = null;

const getBrowser = async (): Promise<Browser> => {
    if (browserInstance && browserInstance.isConnected()) {
        return browserInstance;
    }
    try {
        console.log('Launching new Puppeteer browser instance...');
        browserInstance = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH, // Make sure this is set in Dockerfile ENV
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // common in Docker environments
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                // '--single-process', // Only if not using parallel page creations, can cause issues
                '--disable-gpu'
            ]
        });
        console.log('Puppeteer browser instance launched.');
        browserInstance.on('disconnected', () => {
            console.log('Puppeteer browser instance disconnected.');
            browserInstance = null;
        });
    } catch (error) {
        console.error('Failed to launch Puppeteer browser:', error);
        throw error;
    }
    return browserInstance;
};


export const generatePdfFromHtml = async (htmlContent: string): Promise<Buffer> => {
    let page: Page | null = null;
    try {
        const browser = await getBrowser();
        page = await browser.newPage();

        // Set a realistic viewport if your CSS depends on it, though for PDF it's less critical
        // await page.setViewport({ width: 1080, height: 1024 });

        // Navigate to a blank page or set content directly
        // Using setContent is generally preferred for HTML strings
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { // Example margins
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        });
        return pdfBuffer;
    } catch (error) {
        console.error('Error generating PDF from HTML:', error);
        throw error; // Re-throw to be handled by service/controller
    } finally {
        if (page) {
            await page.close();
        }
        // Consider if browser should be closed here or managed globally (current approach is global instance)
    }
};

// Function to read the HTML template from file system
export const getInvoiceTemplateHtml = async (): Promise<string> => {
    // Resolve path relative to the current file (__dirname might not work as expected with TS/dist)
    // A more robust way is to resolve from project root or pass template path via config
    const templatePath = path.resolve(process.cwd(), 'src/invoice_service/src/templates/invoice-template.html');
    // Fallback if src is not in cwd (e.g. when running from dist)
    const templatePathDist = path.resolve(process.cwd(), 'dist/invoice_service/src/templates/invoice-template.html');


    try {
        return await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
        console.warn(`Could not read template from ${templatePath}, trying dist path...`);
        try {
            return await fs.readFile(templatePathDist, 'utf-8');
        } catch (distError) {
            console.error('Error reading HTML template:', distError);
            throw new Error('Failed to read invoice HTML template.');
        }
    }
};


// Graceful shutdown for Puppeteer browser instance
export const closeBrowser = async () => {
    if (browserInstance && browserInstance.isConnected()) {
        console.log('Closing Puppeteer browser instance...');
        await browserInstance.close();
        browserInstance = null;
        console.log('Puppeteer browser instance closed.');
    }
};

// Hook into process exit signals to close browser
process.on('SIGINT', async () => {
    await closeBrowser();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await closeBrowser();
    process.exit(0);
});
