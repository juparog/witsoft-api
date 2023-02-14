import { Error as MongoError } from "mongoose";
import { ObjectLiteral } from "@witsoft/libs/types/object-literal.type";
import { ExceptionBase } from "../exceptions/exception.base";
import {
	ConflictException,
	UnprocessableEntityException,
} from "../exceptions/exceptions";

export interface ValidationErrors {
	[path: string]: ValidationErrorDetail;
}

export interface ValidationErrorDetail {
	name: string;
	message: string;
	kind: string;
	path: string;
	value: string;
}

export interface ValidationSubErrors {
	field: string;
	message: string;
	type: string;
}

export class CustomMongoMapper {
	static mongoFormatSubErrors(
		error: MongoError.ValidationError,
	): ObjectLiteral[] {
		const subErrors: ObjectLiteral[] = Object.keys(error.errors).map(
			(key: string) => {
				const detail: MongoError.ValidatorError | MongoError.CastError =
					error.errors[key];

				return {
					field: detail.path,
					message: detail.message,
					type: detail.kind,
				};
			},
		);

		return subErrors;
	}

	static processValidationTypeErrors(
		error: MongoError.ValidationError,
	): ExceptionBase {
		const subErrors = error.message.split("||");
		// Validar si el error es de typoentidad ya existente
		const alreadyExistingTypeErrors = subErrors.filter((str) =>
			str.includes("already"),
		);
		if (alreadyExistingTypeErrors.length > 0) {
			return new ConflictException(
				"Record already exists",
				error,
				alreadyExistingTypeErrors,
			);
		}
		return new UnprocessableEntityException(
			"Unprocessable record(s)",
			error,
			subErrors,
		);
	}
}
