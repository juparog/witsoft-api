import { Option } from "oxide.ts";

import { AggregateID } from "@witsoft/libs/ddd/";
import { ClientSession, InsertManyOptions, QueryOptions } from "mongoose";

export class Paginated<T> {
	readonly count: number;
	readonly limit: number;
	readonly page: number;
	readonly data: readonly T[];

	constructor(props: Paginated<T>) {
		this.count = props.count;
		this.limit = props.limit;
		this.page = props.page;
		this.data = props.data;
	}
}

export const OrderByOptions = [
	"asc",
	"desc",
	"ascending",
	"descending",
	1,
	-1,
] as const;

export interface OrderBy {
	[field: string]: typeof OrderByOptions[number];
}

export type PaginatedQueryParams = {
	limit: number;
	page: number;
	offset: number;
	orderBy: OrderBy;
};

export interface RepositoryPort<Entity> {
	findAll(): Promise<Entity[]>;
	findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<Entity>>;
	findOneById(id: string): Promise<Option<Entity>>;
	findByIdAndReplace(
		id: string,
		entity: Entity,
		queryOptions: QueryOptions,
	): Promise<Option<Entity>>;
	findByIdAndUpdate(
		id: string,
		entity: Entity,
		queryOptions: QueryOptions,
	): Promise<Option<Entity>>;

	insert(
		entity: Entity,
		insertManyOptions?: InsertManyOptions,
	): Promise<AggregateID | AggregateID[]>;

	delete(entity: Entity, queryOptions: QueryOptions): Promise<boolean>;

	transaction<T>(handler: (session: ClientSession) => Promise<T>): Promise<T>;
}
