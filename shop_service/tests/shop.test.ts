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
});
