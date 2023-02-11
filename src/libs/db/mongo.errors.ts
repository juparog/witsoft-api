import { Error as MongoError } from "mongoose";
import { ObjectLiteral } from "@witsoft/libs/types/object-literal.type";

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
}
