import { BadRequestException as BadRequestHttpException } from "@nestjs/common";
import { OrderByOptions } from "@witsoft/libs/ddd";
import { TransformFnParams } from "class-transformer";

export const OrderByTransform = ({ value, key: field }: TransformFnParams) => {
	let jsonValue = {};
	try {
		jsonValue = JSON.parse(value);
	} catch (e) {
		throw new BadRequestHttpException([
			`Error validating ${field}, not a valid JSON`,
		]);
	}

	for (const key in jsonValue) {
		if (
			typeof key !== "string" ||
			!Object.values(OrderByOptions).includes(jsonValue[key])
		) {
			throw new BadRequestHttpException([
				`Error validating ${field}, the key ${key} is not of the supported type ${JSON.stringify(
					OrderByOptions,
				)}`,
			]);
		}
	}
	return jsonValue;
};
