import {
	HttpStatus,
	ConflictException as ConflictHttpException,
	BadRequestException as BadRequestHttpException,
} from "@nestjs/common";

import { ExceptionBase } from "@witsoft/libs/exceptions";
import { ObjectLiteral } from "@witsoft/libs/types/object-literal.type";

export class OrganizationAlreadyExistsError extends ExceptionBase {
	static readonly message = "Organization already exists";

	public readonly code = "ORGANIZATION.ALREADY_EXISTS";

	constructor(cause?: Error, metadata?: ObjectLiteral[]) {
		super(OrganizationAlreadyExistsError.message, cause, metadata);
	}
}

export class OrganizationUnprocessableError extends ExceptionBase {
	static readonly message = "Organization is unprocessable";

	public readonly code = "ORGANIZATION.UNPROCESSABLE_ENTITY";

	constructor(cause?: Error, metadata?: ObjectLiteral[]) {
		super(OrganizationUnprocessableError.message, cause, metadata);
	}
}

export const validateOrganizationError = (error: ExceptionBase) => {
	const subErrors: string[] = error.metadata.map((obj: ObjectLiteral) =>
		typeof obj.message === "string" ? obj.message : undefined,
	);

	if (error instanceof OrganizationAlreadyExistsError) {
		throw new ConflictHttpException({
			statusCode: HttpStatus.CONFLICT,
			message: error.message,
			error: "Conflict",
			subErrors: subErrors,
		});
	}
	if (error instanceof OrganizationUnprocessableError) {
		throw new BadRequestHttpException({
			statusCode: HttpStatus.BAD_REQUEST,
			message: error.message,
			error: "Bad Request",
			subErrors: subErrors,
		});
	}
};
