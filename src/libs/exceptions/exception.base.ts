import { RequestContextService } from '@witsoft/libs/application/context/AppRequestContext';

export interface SerializedException {
  message: string;
  code: string;
  correlationId: string;
  stack?: string;
  cause?: string;
  metadata?: unknown;
}

/**
 * Clase base para las excepciones personalizadas.
 *
 * @abstract
 * @class ExceptionBase
 * @extends {Error}
 */
export abstract class ExceptionBase extends Error {
  abstract code: string;

  public readonly correlationId: string;

  /**
   * @param {string} message
   * @param {ObjectLiteral} [metadata={}]
   */
  constructor(
    readonly message: string,
    readonly cause?: Error,
    readonly metadata?: unknown,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    const ctx = RequestContextService.getContext();
    this.correlationId = ctx.requestId;
  }

  toJSON(): SerializedException {
    return {
      message: this.message,
      code: this.code,
      stack: this.stack,
      correlationId: this.correlationId,
      cause: JSON.stringify(this.cause),
      metadata: this.metadata,
    };
  }
}
