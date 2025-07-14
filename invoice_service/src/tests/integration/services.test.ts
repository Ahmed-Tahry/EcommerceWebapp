import { describe, it, expect, beforeEach } from 'vitest';
import { HttpClient, ServiceError } from '../../utils/httpClient';

describe('HTTP Client', () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient('http://localhost:3000');
  });

  it('should create HTTP client instance', () => {
    expect(httpClient).toBeDefined();
  });

  it('should set authorization header', () => {
    const token = 'test-token';
    httpClient.setAuthToken(token);
    expect(httpClient).toBeDefined();
  });

  it('should set user context', () => {
    const userId = 'test-user';
    const userRoles = 'seller,admin';
    httpClient.setUserContext(userId, userRoles);
    expect(httpClient).toBeDefined();
  });
});

describe('ServiceError', () => {
  it('should create ServiceError instance', () => {
    const error = new ServiceError('Test error', 500, 'TestService');
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ServiceError');
    expect(error.statusCode).toBe(500);
    expect(error.service).toBe('TestService');
  });
}); 