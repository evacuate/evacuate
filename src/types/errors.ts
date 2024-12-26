/**
 * Common error type definitions used throughout the application
 */

/**
 * Error code definitions
 */
export const ErrorCode = {
  // API related errors
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',

  // Parsing related errors
  PARSE_ERROR: 'PARSE_ERROR',
  INVALID_DATA: 'INVALID_DATA',

  // Authentication related errors
  AUTH_ERROR: 'AUTH_ERROR',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // System errors
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',

  // Message processing errors
  MESSAGE_ERROR: 'MESSAGE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Base error class
 */
export class BaseError extends Error {
  constructor(
    message: string,
    public readonly errorCode: ErrorCodeType,
    public readonly statusCode: number = 500,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * API related errors
 */
export class APIError extends BaseError {
  constructor(
    message: string,
    errorCode: ErrorCodeType = ErrorCode.API_ERROR,
    statusCode: number = 500,
    details?: unknown,
  ) {
    super(message, errorCode, statusCode, details);
  }
}

/**
 * Parsing related errors
 */
export class ParseError extends BaseError {
  constructor(
    message: string,
    public readonly rawData: unknown,
    errorCode: ErrorCodeType = ErrorCode.PARSE_ERROR,
  ) {
    super(message, errorCode, 400, { rawData });
  }
}

/**
 * Network errors
 */
export class NetworkError extends BaseError {
  constructor(
    message: string,
    public readonly originalError: Error,
    public readonly endpoint?: string,
  ) {
    super(message, ErrorCode.NETWORK_ERROR, 503, {
      originalError: {
        name: originalError.name,
        message: originalError.message,
        stack: originalError.stack,
      },
      endpoint,
    });
  }
}

/**
 * Rate limit errors
 */
export class RateLimitError extends BaseError {
  constructor(
    message: string,
    public readonly retryAfter?: number,
    public readonly platform?: string,
  ) {
    super(message, ErrorCode.RATE_LIMIT_ERROR, 429, {
      retryAfter,
      platform,
    });
  }
}

/**
 * Message processing errors
 */
export class MessageError extends BaseError {
  constructor(
    message: string,
    public readonly platform:
      | 'bluesky'
      | 'mastodon'
      | 'nostr'
      | 'slack'
      | 'telegram',
    public readonly originalError: Error,
    errorCode: ErrorCodeType = ErrorCode.MESSAGE_ERROR,
  ) {
    super(message, errorCode, 500, {
      platform,
      originalError: {
        name: originalError.name,
        message: originalError.message,
        stack: originalError.stack,
      },
    });
  }
}

/**
 * Validation errors
 */
export class ValidationError extends BaseError {
  constructor(
    message: string,
    public readonly validationErrors: Record<string, string[]>,
    errorCode: ErrorCodeType = ErrorCode.VALIDATION_ERROR,
  ) {
    super(message, errorCode, 400, { validationErrors });
  }
}
