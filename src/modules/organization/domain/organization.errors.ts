import {
	NotFoundException as NotFoundHttpException,
	ConflictException as ConflictHttpException,
	BadRequestException as BadRequestHttpException,
} from "@nestjs/common";

import { ExceptionBase } from "@witsoft/libs/exceptions";

export class OrganizationAlreadyExistsError extends ExceptionBase {
	static readonly message = "Organization already exists";

	public readonly code = "ORGANIZATION.ALREADY_EXISTS";

	constructor(cause?: Error, metadata?: string[]) {
		super(OrganizationAlreadyExistsError.message, cause, metadata);
	}
}

export class OrganizationUnprocessableError extends ExceptionBase {
	static readonly message = "Organization is unprocessable";

	public readonly code = "ORGANIZATION.UNPROCESSABLE_ENTITY";

	constructor(cause?: Error, metadata?: string[]) {
		super(OrganizationUnprocessableError.message, cause, metadata);
	}
}

export class OrganizationNotFoundError extends ExceptionBase {
	static readonly message = "Organization not found";

	public readonly code = "ORGANIZATION.NOT_FOUND";

	constructor(cause?: Error, metadata?: string[]) {
		super(OrganizationNotFoundError.message, cause, metadata);
	}
}

export class OrganizationErrorHandler {
	static validateOrganizationError(error: ExceptionBase) {
		if (error instanceof OrganizationAlreadyExistsError) {
			throw new ConflictHttpException(error.metadata || "Conflict", {
				description: error.message,
			});
		}
		if (error instanceof OrganizationUnprocessableError) {
			throw new BadRequestHttpException(error.metadata || "Bad Request", {
				description: error.message,
			});
		}
		if (error instanceof OrganizationNotFoundError) {
			throw new NotFoundHttpException(error.metadata || "Not Found", {
				description: error.message,
			});
		}
	}
}
