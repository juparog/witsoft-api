import { Guard } from "@witsoft/libs/guards/guard";
import { convertPropsToObject } from "@witsoft/libs/utils";
import {
	ArgumentNotProvidedException,
	ArgumentInvalidException,
	ArgumentOutOfRangeException,
} from "../exceptions/exceptions";

export type AggregateID = string;

export interface BaseEntityProps {
	id: AggregateID;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateEntityProps<T> {
	id: AggregateID;
	props: T;
	createdAt?: Date;
	updatedAt?: Date;
}

export abstract class Entity<EntityProps> {
	constructor({
		id,
		createdAt,
		updatedAt,
		props,
	}: CreateEntityProps<EntityProps>) {
		this.setId(id);
		this.validateProps(props);
		const now = new Date();
		this._createdAt = createdAt || now;
		this._updatedAt = updatedAt || now;
		this.props = props;
		this.validate();
	}

	protected readonly props: EntityProps;

	protected abstract _id: AggregateID;

	private readonly _createdAt: Date;

	private _updatedAt: Date;

	get id(): AggregateID {
		return this._id;
	}

	private setId(id: AggregateID): void {
		this._id = id;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	static isEntity(entity: unknown): entity is Entity<unknown> {
		return entity instanceof Entity;
	}

	/**
	 * Comprueba si dos entidades son la misma entidad comparando el campo ID.
	 * @param object Entity
	 */
	public equals(object?: Entity<EntityProps>): boolean {
		if (object === null || object === undefined) {
			return false;
		}

		if (this === object) {
			return true;
		}

		if (!Entity.isEntity(object)) {
			return false;
		}

		return this.id ? this.id === object.id : false;
	}

	/**
	 * Devuelve la **copia** actual de los accesorios de la entidad.
	 * La modificación del estado de la entidad no cambiará previamente creada
	 * Copia devuelta por este método ya que no devuelve una referencia.
	 * Si se necesita una referencia a una propiedad específica, cree un getter en la clase padre.
	 *
	 * @return {*}  {Props & EntityProps}
	 * @memberof Entity
	 */
	public getPropsCopy(): EntityProps & BaseEntityProps {
		const propsCopy = {
			id: this._id,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
			...this.props,
		};
		return Object.freeze(propsCopy);
	}

	/**
	 * Convertir una entidad y todas las sub-entities/Value en un objeto que
	 * contiene un objeto simple con tipos primitivos. Puede ser
	 * útil al registrar una entidad durante las pruebas / depuración
	 */
	public toObject(): unknown {
		const plainProps = convertPropsToObject(this.props);

		const result = {
			id: this._id,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
			...plainProps,
		};
		return Object.freeze(result);
	}

	/**
	 * Hay ciertas reglas que siempre tienen que ser verdaderas (invariantes)
	 * para cada entidad. Se llama al método Validate cada vez antes de
	 * guardar una entidad en la base de datos para asegurarse de que se respetan esas reglas.
	 */
	public abstract validate(): void;

	private validateProps(props: EntityProps): void {
		const MAX_PROPS = 50;

		if (Guard.isEmpty(props)) {
			throw new ArgumentNotProvidedException(
				"Entity props should not be empty",
			);
		}
		if (typeof props !== "object") {
			throw new ArgumentInvalidException("Entity props should be an object");
		}
		if (Object.keys(props as unknown).length > MAX_PROPS) {
			throw new ArgumentOutOfRangeException(
				`Entity props should not have more than ${MAX_PROPS} properties`,
			);
		}
	}
}
