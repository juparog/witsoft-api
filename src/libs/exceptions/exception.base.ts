import { RequestContextService } from "@witsoft/libs/application/context/AppRequestContext";
import { ObjectLiteral } from "@witsoft/libs/types/object-literal.type";

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
	 * @param {Error} cause
	 * @param {ObjectLiteral} [metadata={}]
	 */
	constructor(
		readonly message: string,
		readonly cause?: Error,
		readonly metadata?: ObjectLiteral[],
	) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		const ctx = RequestContextService.getContext();
		this.correlationId = ctx.requestId;
	}

	addMetadata(obj: ObjectLiteral) {
		this.metadata.push(obj);
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
