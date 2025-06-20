import request from 'supertest';
import app from '../src/app'; // Adjust path as necessary
import server from '../src/server'; // Import server to close it after tests
import { describe, it, expect, afterAll } from 'vitest';

describe('Shop Service API', () => {
  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });

  // Test for the root path
  describe('GET /', () => {
    it('should return 200 OK with a welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Shop Service is running!');
    });
  });

  // Test for the placeholder shop info route
  describe('GET /api/shop/info', () => {
    it('should return 200 OK with placeholder shop information', async () => {
      const response = await request(app).get('/api/shop/info');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Shop information placeholder' });
    });
  });

  // Example of a failing test (to be removed or fixed if this was real)
  // describe('Example Failing Test', () => {
  //   it('should fail to demonstrate test execution', () => {
  //     expect(true).toBe(false);
  //   });
  // });
});
