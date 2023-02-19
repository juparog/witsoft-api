import { OrderBy, PaginatedQueryParams } from "../ports/repository.port";

/**
 * Clase base para consultas regulares
 */
export abstract class QueryBase {}

/**
 * Clase base para consultas paginadas
 */
export abstract class PaginatedQueryBase extends QueryBase {
	limit: number;
	offset: number;
	orderBy: OrderBy;
	page: number;

	constructor(props: PaginatedParams<PaginatedQueryBase>) {
		super();
		this.limit = props.limit || 20;
		this.offset = props.page ? props.page * this.limit : 0;
		this.page = props.page || 0;
		this.orderBy = props.orderBy || { createdAt: "asc" };
	}
}

// Parámetros de consulta paginados
export type PaginatedParams<T> = Omit<
	T,
	"limit" | "offset" | "orderBy" | "page"
> &
	Partial<Omit<PaginatedQueryParams, "offset">>;
