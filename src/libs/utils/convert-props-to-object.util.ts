/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { Entity } from "@witsoft/libs/ddd/entity.base";
import { ValueObject } from "@witsoft/libs/ddd/value-object.base";

function isEntity(obj: unknown): obj is Entity<unknown> {
	return (
		Object.prototype.hasOwnProperty.call(obj, "toObject") &&
		Object.prototype.hasOwnProperty.call(obj, "id") &&
		ValueObject.isValueObject((obj as Entity<unknown>).id)
	);
}

function convertToPlainObject(item: any): any {
	if (ValueObject.isValueObject(item)) {
		return item.unpack();
	}
	if (isEntity(item)) {
		return item.toObject();
	}
	return item;
}

/**
 * Convierte objetos de Entity/Value en un objeto simple.
 * Útil para pruebas y depuración.
 * @param props
 */
export function convertPropsToObject(props: any): any {
	const propsCopy = { ...props };

	// eslint-disable-next-line guard-for-in
	for (const prop in propsCopy) {
		if (Array.isArray(propsCopy[prop])) {
			propsCopy[prop] = (propsCopy[prop] as Array<unknown>).map((item) => {
				return convertToPlainObject(item);
			});
		}
		propsCopy[prop] = convertToPlainObject(propsCopy[prop]);
	}

	return propsCopy;
}
