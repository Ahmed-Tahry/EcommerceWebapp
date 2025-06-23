import request from 'supertest';
import { Server } from 'http';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';

import { app, serverInstance as actualServerInstanceImport } from '../src/server';
import { endDBPool, getDBPool } from '../src/utils/db';
import { IProductVat, IAccountSetting } from '../src/models/settings.model';

let testAgent: request.SuperTest<request.Test>;
let liveServer: Server;
const pool = getDBPool(); // Get pool for cleanup tasks

beforeAll(async () => {
  await new Promise<void>((resolve, reject) => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (actualServerInstanceImport && actualServerInstanceImport.listening) {
        clearInterval(interval);
        liveServer = actualServerInstanceImport;
        testAgent = request(liveServer);
        console.log('Test suite connected to live server instance from server.ts for Settings Service.');
        resolve();
      } else if (attempts > 20) { // Approx 10 seconds timeout
        clearInterval(interval);
        console.error('Server instance from server.ts did not start in time for tests.');
        reject(new Error('Server instance from server.ts did not start in time for tests.'));
      }
    }, 500);
  });

  // Initial cleanup of tables
  try {
    await pool.query('DELETE FROM products_vat;');
    await pool.query('DELETE FROM account_settings;');
    console.log('Initial cleanup of products_vat and account_settings tables done.');
  } catch (error) {
    console.warn('Initial cleanup failed, tables might not exist yet or other issue:', error);
  }
}, 15000);

afterAll(async () => {
  try {
    await pool.query('DELETE FROM products_vat;');
    await pool.query('DELETE FROM account_settings;');
    console.log('Final cleanup of products_vat and account_settings tables done.');
  } catch (error) {
    console.error('Error during final cleanup:', error);
  }
  await endDBPool();
  console.log('Test suite finished: DB Pool ended via test afterAll for Settings Service.');
  if (liveServer && liveServer.listening) {
    console.log('Note: Main server instance was not explicitly closed by test afterAll, relying on process shutdown for Settings Service.');
  }
});

beforeEach(async () => {
  // Clean tables before each test to ensure independence
  try {
    await pool.query('DELETE FROM products_vat;');
    await pool.query('DELETE FROM account_settings;');
  } catch (error) {
    console.error('Error cleaning tables in beforeEach:', error);
    // Depending on test strategy, might want to throw error to stop tests
  }
});


describe('Settings Service API', () => {
  describe('GET /', () => {
    it('should return 200 OK with the correct service running message', async () => {
      const response = await testAgent.get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Settings Service is running! (Phase 1)');
    });
  });

  // --- ProductsVat API CRUD Tests ---
  describe('ProductsVat API CRUD (/api/settings/products-vat)', () => {
    const testProductVat1: IProductVat = {
      productId: 'pv001',
      ean: '1234567890123',
      productName: 'Test Product VAT 1',
      basePrice: 100.00,
      vatRate: 21.00,
      vatCategory: 'Standard',
      countryCode: 'NL',
      isCompound: false,
      appliesToShipping: true,
      createdDateTime: new Date(), // Will be set by DB or service
      updatedDateTime: new Date(), // Will be set by DB or service
      isActive: true,
    };

    const testProductVat2: IProductVat = {
      productId: 'pv002',
      ean: '9876543210987',
      productName: 'Test Product VAT 2',
      basePrice: 50.00,
      vatRate: 9.00,
      vatCategory: 'Reduced',
      countryCode: 'DE',
      createdDateTime: new Date(),
      updatedDateTime: new Date(),
      isActive: false,
    };
    let createdProductVatId: string;

    it('POST /products-vat - should create a new product VAT entry', async () => {
      const response = await testAgent.post('/api/settings/products-vat').send(testProductVat1);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('productId', testProductVat1.productId);
      expect(response.body.ean).toBe(testProductVat1.ean);
      expect(response.body.productName).toBe(testProductVat1.productName);
      expect(response.body.vatRate).toBe(testProductVat1.vatRate);
      expect(response.body.countryCode).toBe(testProductVat1.countryCode);
      createdProductVatId = response.body.productId;
    });

    it('POST /products-vat - should return 400 for missing required fields', async () => {
      const { productId, ...incompleteData } = testProductVat1; // Removing productId
      const response = await testAgent.post('/api/settings/products-vat').send(incompleteData);
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Missing required fields');
    });

    it('GET /products-vat/:productId - should retrieve a specific product VAT entry', async () => {
      // First, create an entry to retrieve
      await testAgent.post('/api/settings/products-vat').send(testProductVat1);
      const response = await testAgent.get(`/api/settings/products-vat/${testProductVat1.productId}`);
      expect(response.status).toBe(200);
      expect(response.body.productId).toBe(testProductVat1.productId);
      expect(response.body.ean).toBe(testProductVat1.ean);
    });

    it('GET /products-vat/:productId - should return 404 for non-existent product VAT ID', async () => {
      const response = await testAgent.get('/api/settings/products-vat/nonexistentpv99');
      expect(response.status).toBe(404);
    });

    it('GET /products-vat - should retrieve all product VAT entries', async () => {
      await testAgent.post('/api/settings/products-vat').send(testProductVat1);
      await testAgent.post('/api/settings/products-vat').send(testProductVat2);
      const response = await testAgent.get('/api/settings/products-vat');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body.some(pv => pv.productId === testProductVat1.productId)).toBe(true);
      expect(response.body.some(pv => pv.productId === testProductVat2.productId)).toBe(true);
    });

    it('PUT /products-vat/:productId - should update an existing product VAT entry', async () => {
      await testAgent.post('/api/settings/products-vat').send(testProductVat1);
      const updatedData = { productName: 'Updated Product Name', vatRate: 25.00, isActive: false };
      const response = await testAgent.put(`/api/settings/products-vat/${testProductVat1.productId}`).send(updatedData);
      expect(response.status).toBe(200);
      expect(response.body.productName).toBe('Updated Product Name');
      expect(response.body.vatRate).toBe(25.00);
      expect(response.body.isActive).toBe(false);
      expect(new Date(response.body.updatedDateTime).getTime()).toBeGreaterThanOrEqual(new Date(testProductVat1.updatedDateTime).getTime());
    });

    it('PUT /products-vat/:productId - should return 404 for updating non-existent product VAT ID', async () => {
      const response = await testAgent.put('/api/settings/products-vat/nonexistentpv99').send({ productName: 'No Such Product' });
      expect(response.status).toBe(404);
    });

    it('PUT /products-vat/:productId - should return 400 if productId in body conflicts with path', async () => {
      await testAgent.post('/api/settings/products-vat').send(testProductVat1);
      const updatedData = { productId: 'conflictingID', productName: 'Conflicting Update' };
      const response = await testAgent.put(`/api/settings/products-vat/${testProductVat1.productId}`).send(updatedData);
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Product ID in body does not match ID in path');
    });


    it('DELETE /products-vat/:productId - should delete a product VAT entry', async () => {
      await testAgent.post('/api/settings/products-vat').send(testProductVat1);
      const response = await testAgent.delete(`/api/settings/products-vat/${testProductVat1.productId}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted successfully');

      const getResponse = await testAgent.get(`/api/settings/products-vat/${testProductVat1.productId}`);
      expect(getResponse.status).toBe(404);
    });

    it('DELETE /products-vat/:productId - should return 404 for deleting non-existent product VAT ID', async () => {
      const response = await testAgent.delete('/api/settings/products-vat/nonexistentpv99');
      expect(response.status).toBe(404);
    });
  });

  // --- AccountSettings API CRUD Tests ---
  describe('AccountSettings API CRUD (/api/settings/account-settings)', () => {
    const testAccountSetting1: IAccountSetting = {
      accountId: 'acc001',
      accountName: 'Test Account 1',
      countryCode: 'NL',
      currencyCode: 'EUR',
      defaultFulfilmentMethod: 'FBB',
      vatRegistrationNumber: 'NL123456789B01',
      createdDateTime: new Date(),
      updatedDateTime: new Date(),
      isActive: true,
    };

    const testAccountSetting2: IAccountSetting = {
      accountId: 'acc002',
      accountName: 'Test Account 2',
      countryCode: 'DE',
      currencyCode: 'EUR',
      isActive: false,
      createdDateTime: new Date(),
      updatedDateTime: new Date(),
    };
    let createdAccountSettingId: string;

    it('POST /account-settings - should create a new account setting', async () => {
      const response = await testAgent.post('/api/settings/account-settings').send(testAccountSetting1);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accountId', testAccountSetting1.accountId);
      expect(response.body.accountName).toBe(testAccountSetting1.accountName);
      expect(response.body.countryCode).toBe(testAccountSetting1.countryCode);
      createdAccountSettingId = response.body.accountId;
    });

    it('POST /account-settings - should return 400 for missing required fields', async () => {
      const { accountId, ...incompleteData } = testAccountSetting1; // Removing accountId
      const response = await testAgent.post('/api/settings/account-settings').send(incompleteData);
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Missing required fields');
    });

    it('GET /account-settings/:accountId - should retrieve a specific account setting', async () => {
      await testAgent.post('/api/settings/account-settings').send(testAccountSetting1);
      const response = await testAgent.get(`/api/settings/account-settings/${testAccountSetting1.accountId}`);
      expect(response.status).toBe(200);
      expect(response.body.accountId).toBe(testAccountSetting1.accountId);
      expect(response.body.accountName).toBe(testAccountSetting1.accountName);
    });

    it('GET /account-settings/:accountId - should return 404 for non-existent account ID', async () => {
      const response = await testAgent.get('/api/settings/account-settings/nonexistentacc99');
      expect(response.status).toBe(404);
    });

    it('GET /account-settings - should retrieve all account settings', async () => {
      await testAgent.post('/api/settings/account-settings').send(testAccountSetting1);
      await testAgent.post('/api/settings/account-settings').send(testAccountSetting2);
      const response = await testAgent.get('/api/settings/account-settings');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body.some(as => as.accountId === testAccountSetting1.accountId)).toBe(true);
      expect(response.body.some(as => as.accountId === testAccountSetting2.accountId)).toBe(true);
    });

    it('PUT /account-settings/:accountId - should update an existing account setting', async () => {
      await testAgent.post('/api/settings/account-settings').send(testAccountSetting1);
      const updatedData = { accountName: 'Updated Account Name', currencyCode: 'USD', isActive: false };
      const response = await testAgent.put(`/api/settings/account-settings/${testAccountSetting1.accountId}`).send(updatedData);
      expect(response.status).toBe(200);
      expect(response.body.accountName).toBe('Updated Account Name');
      expect(response.body.currencyCode).toBe('USD');
      expect(response.body.isActive).toBe(false);
      expect(new Date(response.body.updatedDateTime).getTime()).toBeGreaterThanOrEqual(new Date(testAccountSetting1.updatedDateTime).getTime());
    });

    it('PUT /account-settings/:accountId - should return 404 for updating non-existent account ID', async () => {
      const response = await testAgent.put('/api/settings/account-settings/nonexistentacc99').send({ accountName: 'No Such Account' });
      expect(response.status).toBe(404);
    });

    it('PUT /account-settings/:accountId - should return 400 if accountId in body conflicts with path', async () => {
      await testAgent.post('/api/settings/account-settings').send(testAccountSetting1);
      const updatedData = { accountId: 'conflictingAccID', accountName: 'Conflicting Update' };
      const response = await testAgent.put(`/api/settings/account-settings/${testAccountSetting1.accountId}`).send(updatedData);
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Account ID in body does not match ID in path');
    });

    it('DELETE /account-settings/:accountId - should delete an account setting', async () => {
      await testAgent.post('/api/settings/account-settings').send(testAccountSetting1);
      const response = await testAgent.delete(`/api/settings/account-settings/${testAccountSetting1.accountId}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted successfully');

      const getResponse = await testAgent.get(`/api/settings/account-settings/${testAccountSetting1.accountId}`);
      expect(getResponse.status).toBe(404);
    });

    it('DELETE /account-settings/:accountId - should return 404 for deleting non-existent account ID', async () => {
      const response = await testAgent.delete('/api/settings/account-settings/nonexistentacc99');
      expect(response.status).toBe(404);
    });
  });
});
