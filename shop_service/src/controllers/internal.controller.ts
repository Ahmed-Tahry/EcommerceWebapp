import { Request, Response, NextFunction } from 'express';
import * as ShopService from '../services/shop.service'; // For getBolCredentials, getProductsVatInfoByIds
import BolService from '../services/bol.service'; // Import the BolService class itself

export const handleGetProductsVatInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productIdsQuery = req.query.product_ids as string;

        if (!productIdsQuery) {
            return res.status(400).json({ message: 'Missing product_ids query parameter.' });
        }

        const productIds = productIdsQuery.split(',').map(id => id.trim()).filter(id => id);

        if (productIds.length === 0) {
            return res.status(400).json({ message: 'No product_ids provided or invalid format.' });
        }

        // Assuming product IDs from invoice_service are strings that match the type of product IDs in shop_service DB
        // If they are numbers, conversion might be needed: productIds.map(id => parseInt(id, 10))
        // For now, keeping them as strings.

        const productsVatInfo = await ShopService.getProductsVatInfoByIds(productIds);

        // The expected response structure by invoice_service is { products: [...] }
        res.status(200).json({ products: productsVatInfo });

    } catch (error) {
        console.error('InternalController error getting products VAT info:', error);
        next(error); // Pass to a generic error handler
    }
};

interface InvoiceUploadRequestBody {
    invoicePdfBase64: string;
    invoiceFilename: string;
}

export const handleUploadInvoiceOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const { invoicePdfBase64, invoiceFilename } = req.body as InvoiceUploadRequestBody;

        if (!orderId) {
            return res.status(400).json({ message: 'Missing orderId parameter.' });
        }
        if (!invoicePdfBase64 || !invoiceFilename) {
            return res.status(400).json({ message: 'Missing invoicePdfBase64 or invoiceFilename in request body.' });
        }

        // Decode base64 PDF to buffer
        const invoicePdfBuffer = Buffer.from(invoicePdfBase64, 'base64');

        // Get an instance of BolService.
        // This part depends on how BolService is instantiated and accessed.
        // Assuming there's a way to get a BolService instance, possibly user-specific if credentials vary.
        // For now, let's assume a global or default BolService instance or a factory.
        // This needs to be adapted to your actual BolService instantiation pattern.
        // const userId = req.headers['x-user-id'] as string; // Or however you get context for Bol credentials
        // if (!userId) {
        //     return res.status(400).json({ message: "User context (e.g., x-user-id header) is required for Bol.com API operations." });
        // }
        // const credentials = await ShopService.getBolCredentials(userId); // Assuming getBolCredentials is in ShopService
        // const bolService = new BolService(credentials.clientId, credentials.clientSecret);

        // SIMPLIFIED: Assuming a default/singleton BolService for now.
        // In a real multi-user system, BolService would be instantiated with user-specific credentials.
        // The BolService class needs to be imported.
        // This is a placeholder and needs proper BolService instantiation.
        // const bolServiceInstance = new ShopService.BolService("dummyClientId", "dummyClientSecret"); // Placeholder instantiation

        // Attempt to get userId from a header; this needs to be standardized for inter-service calls
        const userId = req.headers['x-user-id'] as string;
        if (!userId) {
             // If no userId, and if there's a "system" or "default" Bol account for such operations,
             // getBolCredentials might need to support that. Otherwise, it's an error.
             // For now, require userId for credentialed operations.
            console.error("handleUploadInvoiceOrder: x-user-id header is missing for Bol.com API credentials.");
            return res.status(401).json({ message: "User context (x-user-id header) is required for this operation." });
        }

        let bolServiceInstance: BolService;
        try {
            const credentials = await ShopService.getBolCredentials(userId); // getBolCredentials is in shop.service.ts
            bolServiceInstance = new BolService(credentials.clientId, credentials.clientSecret);
        } catch (credError) {
            console.error(`Failed to instantiate BolService for user ${userId}:`, credError);
            return res.status(500).json({ message: "Failed to initialize Bol.com API client due to credential issue." });
        }

        if (!bolServiceInstance || typeof bolServiceInstance.uploadInvoicePdf !== 'function') {
            console.error("BolService not available or uploadInvoicePdf method missing.");
            return res.status(500).json({ message: "Internal server error: BolService misconfiguration." });
        }

        const uploadResult = await bolServiceInstance.uploadInvoicePdf(orderId, invoicePdfBuffer, invoiceFilename);

        if (uploadResult.success) {
            res.status(200).json({ message: 'Invoice uploaded to Bol.com successfully.', details: uploadResult.bolResponse });
        } else {
            res.status(502).json({ message: 'Failed to upload invoice to Bol.com.', error: uploadResult.error, details: uploadResult.bolResponse });
        }

    } catch (error) {
        console.error('InternalController error uploading invoice to Bol.com:', error);
        next(error);
    }
};
