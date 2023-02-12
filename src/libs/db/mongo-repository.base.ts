import { EventEmitter2 } from "@nestjs/event-emitter";
import { Connection, Document, Error as MongoError, Schema } from "mongoose";
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
import { UnprocessableEntityException } from "@witsoft/libs/exceptions";

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

	async delete(entity: Aggregate): Promise<boolean> {
		entity.validate();
		this.logger.debug(
			`[${RequestContextService.getRequestId()}] deleting entities ${
				entity.id
			} from ${this.modelName}`,
		);
		const mongoModel = this.pool.model(this.modelName, this.mongoSchema);
		const result: unknown = await mongoModel.deleteOne({ _id: entity.id });
		await entity.publishEvents(this.logger, this.eventEmitter);

		return (result as number) > 0;
	}

	async insert(
		entity: Aggregate | Aggregate[],
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
			await mongoModel.insertMany(records);
			await Promise.all(
				entities.map((entity) =>
					entity.publishEvents(this.logger, this.eventEmitter),
				),
			);
			return entityIds.length === 1 ? entityIds[0] : entityIds;
		} catch (error) {
			if (error instanceof MongoError.ValidationError) {
				const subErrors = CustomMongoMapper.mongoFormatSubErrors(error);
				subErrors.forEach((error) => {
					this.logger.error(
						`[${RequestContextService.getRequestId()}] ${error.field} ::: ${
							error.message
						}`,
					);
				});

				throw new UnprocessableEntityException(
					"Record already exists",
					error,
					subErrors,
				);
			}
			throw error;
		}
	}

	public async transaction<T>(handler: () => Promise<T>): Promise<T> {
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
				result = await handler();
				this.logger.debug(
					`[${RequestContextService.getRequestId()}] transaction committed with db session id ${dbSessionId.toUUID()}`,
				);
				return result;
			} catch (e) {
				this.logger.error(
					`[${RequestContextService.getRequestId()}] transaction aborted with session id ${dbSessionId.toUUID()}`,
				);
				throw e;
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
