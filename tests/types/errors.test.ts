import { describe, expect, it } from 'vitest';
import {
  APIError,
  BaseError,
  ErrorCode,
  NetworkError,
  ParseError,
  RateLimitError,
} from '~/types/errors';

describe('Error Types', () => {
  describe('BaseError', () => {
    it('should create a base error with correct properties', () => {
      const error = new BaseError('Test error', ErrorCode.SYSTEM_ERROR, 500);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(BaseError);
      expect(error.message).toBe('Test error');
      expect(error.errorCode).toBe(ErrorCode.SYSTEM_ERROR);
      expect(error.statusCode).toBe(500);
    });
  });

  describe('APIError', () => {
    it('should create an API error with default values', () => {
      const error = new APIError('API error');
      expect(error).toBeInstanceOf(BaseError);
      expect(error.message).toBe('API error');
      expect(error.errorCode).toBe(ErrorCode.API_ERROR);
      expect(error.statusCode).toBe(500);
    });

    it('should create an API error with custom values', () => {
      const error = new APIError('Custom API error', ErrorCode.AUTH_ERROR, 401);
      expect(error.message).toBe('Custom API error');
      expect(error.errorCode).toBe(ErrorCode.AUTH_ERROR);
      expect(error.statusCode).toBe(401);
    });
  });

  describe('ParseError', () => {
    it('should create a parse error with raw data', () => {
      const rawData = { invalid: 'data' };
      const error = new ParseError('Parse error', rawData);
      expect(error).toBeInstanceOf(BaseError);
      expect(error.message).toBe('Parse error');
      expect(error.errorCode).toBe(ErrorCode.PARSE_ERROR);
      expect(error.statusCode).toBe(400);
      expect(error.rawData).toBe(rawData);
    });
  });

  describe('NetworkError', () => {
    it('should create a network error with original error', () => {
      const originalError = new Error('Original error');
      const error = new NetworkError('Network error', originalError);
      expect(error).toBeInstanceOf(BaseError);
      expect(error.message).toBe('Network error');
      expect(error.errorCode).toBe(ErrorCode.NETWORK_ERROR);
      expect(error.statusCode).toBe(503);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('RateLimitError', () => {
    it('should create a rate limit error with retry after', () => {
      const error = new RateLimitError('Rate limit exceeded', 60);
      expect(error).toBeInstanceOf(BaseError);
      expect(error.message).toBe('Rate limit exceeded');
      expect(error.errorCode).toBe(ErrorCode.RATE_LIMIT_ERROR);
      expect(error.statusCode).toBe(429);
      expect(error.retryAfter).toBe(60);
    });
  });
}); 