import request from 'supertest';
import { Server } from 'http';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

// Import app and the serverInstance (which might be undefined initially)
import { app, serverInstance as actualServerInstanceImport } from '../src/server';
import { endDBPool, getDBPool, testDBConnection } from '../src/utils/db';
import config from '../src/config/config';

let testAgent: request.SuperTest<request.Test>;
let liveServer: Server; // To hold the actual running server instance for this test file

// Mock server.ts's top-level startServer call for controlled testing if needed,
// but given it auto-starts, we'll hook into the exported serverInstance.

beforeAll(async () => {
  // Ensure DB pool is available for the app; server.ts should handle its init
  // getDBPool(); // server.ts calls this.

  // Wait for the serverInstance from server.ts to be initialized
  // This is a common pattern when the server starts itself upon module import.
  await new Promise<void>((resolve, reject) => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (actualServerInstanceImport && actualServerInstanceImport.listening) {
        clearInterval(interval);
        liveServer = actualServerInstanceImport; // Use the live server instance
        testAgent = request(liveServer); // Create agent once server is confirmed listening
        console.log('Test suite connected to live server instance from server.ts.');
        resolve();
      } else if (attempts > 20) { // Approx 10 seconds timeout
        clearInterval(interval);
        console.error('Server instance from server.ts did not start in time for tests.');
        reject(new Error('Server instance from server.ts did not start in time for tests.'));
      }
    }, 500); // Check every 500ms
  });
}, 15000); // Vitest timeout for beforeAll

afterAll(async () => {
  // The main serverInstance (actualServerInstanceImport) handles its own shutdown via SIGINT/SIGTERM.
  // For tests, we might not need to explicitly close it if the test runner handles process termination.
  // However, closing the DB pool is good practice.
  await endDBPool();
  console.log('Test suite finished: DB Pool ended via test afterAll.');

  // If liveServer was successfully assigned, it means the actual server is running.
  // We don't necessarily need to close it here if the process will terminate.
  // If tests were running in a persistent environment, explicit close would be needed.
  // For CI/CLI, process termination handles it.
  if (liveServer && liveServer.listening) {
      // server.ts has shutdown hooks. If we explicitly close here,
      // it might conflict or be redundant.
      // For now, let the main process shutdown handle serverInstance.
      console.log('Note: Main server instance was not explicitly closed by test afterAll, relying on process shutdown.');
  }
});

describe('Shop Service API', () => {
  describe('GET /', () => {
    it('should return 200 OK with a welcome message', async () => {
      const response = await testAgent.get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Shop Service is running! (Phase 1)'); // Message from app.ts
    });
  });

  describe('GET /api/shop/info', () => {
    it('should return 200 OK with shop information and database time', async () => {
      // Ensure DB is connectable for this specific test, as server might start even if DB is down (in test env)
      const canConnect = await testDBConnection();
      if (!canConnect && config.env === 'test') {
         console.warn("DB connection failed in test for GET /api/shop/info. This test might be unreliable if endpoint strictly needs DB.");
         // Depending on strictness, you might fail the test here:
         // expect(canConnect, "Database must be connectable for this test").toBe(true);
      } else if (!canConnect) {
        // Fail if not in test env and DB is down
        expect(canConnect, "Database must be connectable for this test").toBe(true);
      }

      const response = await testAgent.get('/api/shop/info');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Shop information with current DB time');
      expect(response.body).toHaveProperty('databaseTime');
      // Check if databaseTime is a valid ISO 8601 string (or similar, depending on DB)
      expect(response.body.databaseTime).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?/);
    });

    it('should handle database errors gracefully', async () => {
      // Temporarily mock the pool query to simulate a DB error
      const pool = getDBPool();
      const originalQuery = pool.query;
      pool.query = vi.fn().mockRejectedValueOnce(new Error('Simulated DB Error for test'));

      const response = await testAgent.get('/api/shop/info');
      expect(response.status).toBe(500); // Assuming errorHandler sends 500
      expect(response.body).toHaveProperty('message', 'Simulated DB Error for test');

      pool.query = originalQuery; // Restore original query function
    });
  });

  // New tests for DB tables
  describe('Database Tables CRUD (Offers, Orders, OrderItems)', () => {
    const testOfferId = 'test-offer-001';
    const testOrderId = 'test-order-001';
    const testOrderItemId = 'test-orderitem-001';
    const testEan = '1234567890123';

    beforeAll(async () => {
      // Clean up before tests, if necessary, or rely on migrations to set up
      // For simplicity, assuming migrations have run and tables are empty or test data is non-conflicting
      const pool = getDBPool();
      try {
        // Clean up any previous test data to ensure a clean slate
        await pool.query('DELETE FROM order_items WHERE "orderItemId" = $1 OR ean = $2', [testOrderItemId, testEan]);
        await pool.query('DELETE FROM orders WHERE "orderId" = $1', [testOrderId]);
        await pool.query('DELETE FROM offers WHERE "offerId" = $1 OR ean = $2', [testOfferId, testEan]);
        console.log('Cleaned up old test data for CRUD tests.');
      } catch (error) {
        console.warn('Could not clean up old test data, tables might not exist yet or other issue:', error);
      }
    });

    afterAll(async () => {
      // Clean up test data after tests
      const pool = getDBPool();
      try {
        await pool.query('DELETE FROM order_items WHERE "orderItemId" = $1 OR ean = $2', [testOrderItemId, testEan]);
        await pool.query('DELETE FROM orders WHERE "orderId" = $1', [testOrderId]);
        await pool.query('DELETE FROM offers WHERE "offerId" = $1 OR ean = $2', [testOfferId, testEan]);
        console.log('Cleaned up test data after CRUD tests.');
      } catch (error) {
        console.error('Error cleaning up test data:', error);
      }
    });

    it('should create and retrieve an offer', async () => {
      const pool = getDBPool();
      const offerData = {
        offerId: testOfferId,
        ean: testEan,
        conditionName: 'New',
        stockAmount: 10,
        mutationDateTime: new Date(),
      };
      await pool.query(
        'INSERT INTO offers ("offerId", ean, "conditionName", "stockAmount", "mutationDateTime") VALUES ($1, $2, $3, $4, $5)',
        [offerData.offerId, offerData.ean, offerData.conditionName, offerData.stockAmount, offerData.mutationDateTime]
      );

      const { rows } = await pool.query('SELECT * FROM offers WHERE "offerId" = $1', [testOfferId]);
      expect(rows.length).toBe(1);
      expect(rows[0].ean).toBe(testEan);
      expect(rows[0].stockAmount).toBe(10);
    });

    it('should create and retrieve an order with order items', async () => {
      const pool = getDBPool();
      const orderData = {
        orderId: testOrderId,
        orderPlacedDateTime: new Date(),
        orderItems: JSON.stringify([{ itemId: 'itemA', quantity: 1 }, { itemId: 'itemB', quantity: 2 }]), // Example JSONB content
      };
      await pool.query(
        'INSERT INTO orders ("orderId", "orderPlacedDateTime", "orderItems") VALUES ($1, $2, $3)',
        [orderData.orderId, orderData.orderPlacedDateTime, orderData.orderItems]
      );

      const orderItemData = {
        orderItemId: testOrderItemId,
        orderId: testOrderId,
        ean: testEan,
        quantity: 5,
        fulfilmentMethod: 'SHIP',
        latestChangedDateTime: new Date(),
      };
      await pool.query(
        'INSERT INTO order_items ("orderItemId", "orderId", ean, quantity, "fulfilmentMethod", "latestChangedDateTime") VALUES ($1, $2, $3, $4, $5, $6)',
        [orderItemData.orderItemId, orderItemData.orderId, orderItemData.ean, orderItemData.quantity, orderItemData.fulfilmentMethod, orderItemData.latestChangedDateTime]
      );

      // Retrieve order
      const { rows: orderRows } = await pool.query('SELECT * FROM orders WHERE "orderId" = $1', [testOrderId]);
      expect(orderRows.length).toBe(1);
      expect(orderRows[0].orderItems).toEqual([{ itemId: 'itemA', quantity: 1 }, { itemId: 'itemB', quantity: 2 }]); // Check JSONB content

      // Retrieve order item
      const { rows: orderItemRows } = await pool.query('SELECT * FROM order_items WHERE "orderItemId" = $1', [testOrderItemId]);
      expect(orderItemRows.length).toBe(1);
      expect(orderItemRows[0].ean).toBe(testEan);
      expect(orderItemRows[0].quantity).toBe(5);
      expect(orderItemRows[0].orderId).toBe(testOrderId); // Check foreign key relationship
    });

     it('should update an existing offer', async () => {
      const pool = getDBPool();
      const newStockAmount = 20;
      await pool.query('UPDATE offers SET "stockAmount" = $1 WHERE "offerId" = $2', [newStockAmount, testOfferId]);

      const { rows } = await pool.query('SELECT "stockAmount" FROM offers WHERE "offerId" = $1', [testOfferId]);
      expect(rows[0].stockAmount).toBe(newStockAmount);
    });

    it('should delete an offer (and cascade delete related order_items if FK was set up for offers)', async () => {
      const pool = getDBPool();
      // First, ensure related order_items that might prevent deletion are handled if necessary
      // (For this test, we are deleting an offer not directly linked to the testOrderItemId via EAN in a strict FK way,
      //  but good to be mindful of such dependencies)

      await pool.query('DELETE FROM offers WHERE "offerId" = $1', [testOfferId]);
      const { rows } = await pool.query('SELECT * FROM offers WHERE "offerId" = $1', [testOfferId]);
      expect(rows.length).toBe(0);

      // Verify dependent data is handled if cascading deletes are expected on other tables.
      // Here, order_items are linked to orders, not directly offers by offerId.
      // If ean was a foreign key from order_items to offers, that would be different.
    });


    it('should enforce NOT NULL constraints (example: offers.ean)', async () => {
      const pool = getDBPool();
      try {
        await pool.query('INSERT INTO offers ("offerId", ean) VALUES ($1, NULL)', ['test-offer-null-ean']);
        // If it reaches here, the constraint failed or didn't exist
        throw new Error('NULL constraint on offers.ean was not enforced');
      } catch (error: any) {
        expect(error.message).toContain('null value in column "ean"'); // PostgreSQL error message
      }
    });

    it('should enforce foreign key constraint from order_items to orders', async () => {
        const pool = getDBPool();
        const nonExistentOrderId = 'non-existent-order-id-for-fk-test';
        try {
            await pool.query(
                'INSERT INTO order_items ("orderItemId", "orderId", ean, quantity) VALUES ($1, $2, $3, $4)',
                ['fk-test-item-001', nonExistentOrderId, '0000000000000', 1]
            );
            throw new Error('Foreign key constraint order_items.orderId to orders.orderId was not enforced');
        } catch (error: any) {
            // PostgreSQL error code for foreign key violation is '23503'
            expect(error.code === '23503' || error.message.includes('violates foreign key constraint')).toBe(true);
        }
    });

  });
});
