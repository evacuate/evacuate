import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { StatusCode } from 'hono/utils/http-status';
import { getLogger } from '~/index';
import { BaseError, ErrorCode, ErrorCodeType } from '~/types/errors';

interface ErrorResponse {
  error: {
    code: ErrorCodeType;
    message: string;
    details?: unknown;
    timestamp: string;
    requestId?: string;
    path?: string;
    method?: string;
  };
}

const createErrorResponse = (
  code: ErrorCodeType,
  message: string,
  details?: unknown,
  requestId?: string,
  path?: string,
  method?: string,
): ErrorResponse => ({
  error: {
    code,
    message,
    details,
    timestamp: new Date().toISOString(),
    requestId,
    path,
    method,
  },
});

const logError = async (
  logger: ReturnType<typeof getLogger> extends Promise<infer T> ? T : never,
  err: unknown,
  errorCode: ErrorCodeType,
  statusCode: number,
  requestId?: string,
  path?: string,
  method?: string,
) => {
  logger.error({
    err,
    errorCode,
    statusCode,
    requestId,
    path,
    method,
    stack: err instanceof Error ? err.stack : undefined,
  });
};

/**
 * Global error handler
 * Catches errors from the application and returns appropriate responses
 */
export const errorHandler = async (
  err: unknown,
  c: Context,
): Promise<Response> => {
  const logger = await getLogger();
  const requestId = c.req.header('x-request-id');
  const path = c.req.path;
  const method = c.req.method;

  if (err instanceof HTTPException) {
    const response = createErrorResponse(
      ErrorCode.API_ERROR,
      err.message,
      undefined,
      requestId,
      path,
      method,
    );

    await logError(
      logger,
      err,
      ErrorCode.API_ERROR,
      err.status,
      requestId,
      path,
      method,
    );

    return new Response(JSON.stringify(response), {
      status: err.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (err instanceof BaseError) {
    const response = createErrorResponse(
      err.errorCode,
      err.message,
      err.details,
      requestId,
      path,
      method,
    );

    await logError(
      logger,
      err,
      err.errorCode,
      err.statusCode,
      requestId,
      path,
      method,
    );

    return new Response(JSON.stringify(response), {
      status: err.statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response = createErrorResponse(
    ErrorCode.UNEXPECTED_ERROR,
    err instanceof Error ? err.message : 'An unexpected error occurred',
    undefined,
    requestId,
    path,
    method,
  );

  await logError(
    logger,
    err,
    ErrorCode.UNEXPECTED_ERROR,
    500,
    requestId,
    path,
    method,
  );

  return new Response(JSON.stringify(response), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
};
