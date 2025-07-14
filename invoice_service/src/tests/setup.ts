import { vi, beforeAll, afterAll } from 'vitest';

// Global test setup
beforeAll(() => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/invoice_service_test';
  process.env.SETTINGS_SERVICE_URL = 'http://localhost:3001';
  process.env.SHOP_SERVICE_URL = 'http://localhost:3002';
});

// Global test cleanup
afterAll(() => {
  vi.clearAllMocks();
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}; 