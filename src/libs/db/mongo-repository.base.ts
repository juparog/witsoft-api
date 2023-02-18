import { EventEmitter2 } from "@nestjs/event-emitter";
import {
	ClientSession,
	Connection,
	Document,
	Error as MongoError,
	InsertManyOptions,
	QueryOptions,
	Schema,
} from "mongoose";
import { None, Option, Some } from "oxide.ts";

import { RequestContextService } from "@witsoft/libs/application/context/AppRequestContext";
import {
	AggregateID,
	AggregateRoot,
	Mapper,
	PaginatedQueryParams,
	Paginated,
	RepositoryPort,
} from "@witsoft/libs/ddd";

import { LoggerPort } from "../ports/logger.port";
import { CustomMongoMapper } from "./mongo.errors";

export abstract class MongoRepositoryBase<
	Aggregate extends AggregateRoot<unknown>,
	DbModel,
> implements RepositoryPort<Aggregate>
{
	protected abstract modelName: string;
	protected abstract mongoSchema: Schema;

	protected constructor(
		private readonly _pool: Connection,
		protected readonly mapper: Mapper<Aggregate, DbModel>,
		protected readonly eventEmitter: EventEmitter2,
		protected readonly logger: LoggerPort,
	) {}

	async findOneById(id: string): Promise<Option<Aggregate>> {
		const mongoModel = this.pool.model(this.modelName, this.mongoSchema);
		const result: DbModel = await mongoModel.findById(id);

		return result ? Some(this.mapper.toDomain(result)) : None;
	}

	async findAll(): Promise<Aggregate[]> {
		const mongoModel = this.pool.model(this.modelName, this.mongoSchema);
		const result: DbModel[] = await mongoModel.find<DbModel>({});

		return result.map(this.mapper.toDomain);
	}

	async findAllPaginated(
		params: PaginatedQueryParams,
	): Promise<Paginated<Aggregate>> {
		const mongoModel = this.pool.model(this.modelName, this.mongoSchema);
		const count: number = await mongoModel.count({});
		const result: Document<unknown>[] = await mongoModel
			.find({})
			.limit(params.limit)
			.skip(params.offset);
		const entities = result.map(this.mapper.toDomain);

		return new Paginated({
			data: entities,
			count,
			limit: params.limit,
			page: params.page,
		});
	}

	async findByIdAndReplace(
		id: string,
		entity: Aggregate,
		queryOptions?: QueryOptions,
	): Promise<Option<Aggregate>> {
		const record = this.mapper.toPersistence(entity);
		const mongoModel = this.pool.model(this.modelName, this.mongoSchema);

		const result = await mongoModel.findByIdAndUpdate({ _id: id }, record, {
			new: true,
			...queryOptions,
		});

		return result ? Some(this.mapper.toDomain(result)) : None;
	}

	async findByIdAndUpdate(
		id: string,
		entity: Aggregate,
		queryOptions?: QueryOptions,
	): Promise<Option<Aggregate>> {
		const record = this.mapper.toPersistence(entity);
		const mongoModel = this.pool.model(this.modelName, this.mongoSchema);

		const result: DbModel = await mongoModel.findByIdAndUpdate(
			{ _id: id },
			record,
			{ new: true, ...queryOptions },
		);

		return result ? Some(this.mapper.toDomain(result)) : None;
	}

	async insert(
		entity: Aggregate | Aggregate[],
		insertManyOptions?: InsertManyOptions,
	): Promise<AggregateID | AggregateID[]> {
		const entities = Array.isArray(entity) ? entity : [entity];

		try {
			entities.forEach((entity) => entity.validate());

			const entityIds = entities.map((e) => e.id);
			this.logger.debug(
				`[${RequestContextService.getRequestId()}] writing ${
					entities.length
				} entities to "${this.modelName}" model, Ids: ${entityIds}`,
			);

			const records = entities.map(this.mapper.toPersistence);
			const mongoModel = this.pool.model(this.modelName, this.mongoSchema);
			await mongoModel.insertMany(records, insertManyOptions);
			await Promise.all(
				entities.map((entity) =>
					entity.publishEvents(this.logger, this.eventEmitter),
				),
			);
			return entityIds.length === 1 ? entityIds[0] : entityIds;
		} catch (error) {
			if (error instanceof MongoError.ValidationError) {
				const validationError =
					CustomMongoMapper.processValidationTypeErrors(error);

				validationError.metadata?.forEach((error) => {
					this.logger.error(
						`[${RequestContextService.getRequestId()}] ${error}`,
					);
				});

				throw validationError;
			}
			throw error;
		}
	}

	async delete(
		entity: Aggregate,
		queryOptions?: QueryOptions,
	): Promise<boolean> {
		entity.validate();
		this.logger.debug(
			`[${RequestContextService.getRequestId()}] deleting entities ${
				entity.id
			} from ${this.modelName}`,
		);
		const mongoModel = this.pool.model(this.modelName, this.mongoSchema);
		const result: unknown = await mongoModel.deleteOne(
			{ _id: entity.id },
			queryOptions,
		);
		await entity.publishEvents(this.logger, this.eventEmitter);

		return (result as number) > 0;
	}

	public async transaction<T>(
		handler: (session: ClientSession) => Promise<T>,
	): Promise<T> {
		let result: T;
		if (!RequestContextService.getTransactionConnection()) {
			RequestContextService.setTransactionConnection(this._pool);
		}

		await this.pool.transaction(async (session) => {
			const { id: dbSessionId } = session.id;
			this.logger.debug(
				`[${RequestContextService.getRequestId()}] transaction started with session id ${dbSessionId.toUUID()}`,
			);

			try {
				result = await handler(session);
				this.logger.debug(
					`[${RequestContextService.getRequestId()}] transaction committed with db session id ${dbSessionId.toUUID()}`,
				);
				return result;
			} catch (err) {
				this.logger.error(
					`[${RequestContextService.getRequestId()}] transaction aborted with session id ${dbSessionId.toUUID()}, ${err}`,
				);
				throw err;
			} finally {
				RequestContextService.cleanTransactionConnection();
			}
		});

		return result;
	}

	protected get pool(): Connection {
		return (
			RequestContextService.getContext().transactionConnection ?? this._pool
		);
	}
}
