import {
	UnauthorizedException as UnauthorizedHttpException,
	ForbiddenException as ForbiddenHttpException,
} from "@nestjs/common";

import { ExceptionBase } from "@witsoft/libs/exceptions";

export class AuthUnauthorizedEntityError extends ExceptionBase {
	static readonly message = "Unauthorized entity";

	public readonly code = "AUTH.UNAUTHORIZED_ENTITY";

	constructor(cause?: Error, metadata?: string[]) {
		super(AuthUnauthorizedEntityError.message, cause, metadata);
	}
}

export class AuthForbiddenResourceError extends ExceptionBase {
	static readonly message = "Forbidden resource";

	public readonly code = "AUTH.FORBIDDEN_RESOURCE";

	constructor(cause?: Error, metadata?: string[]) {
		super(AuthForbiddenResourceError.message, cause, metadata);
	}
}

export class AuthnErrorHandler {
	static validateOrganizationError(error: ExceptionBase) {
		if (error instanceof AuthUnauthorizedEntityError) {
			throw new UnauthorizedHttpException(error.metadata || "Unauthorized", {
				description: error.message,
			});
		}
		if (error instanceof AuthForbiddenResourceError) {
			throw new ForbiddenHttpException(error.metadata || "Forbidden", {
				description: error.message,
			});
		}
	}
}
