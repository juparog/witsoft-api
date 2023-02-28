import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection, Schema } from "mongoose";
import { Option, Some, None } from "oxide.ts";

import { MongoRepositoryBase } from "@witsoft/libs/db/";

import { OrganizationEntity } from "../domain/organization.entity";
import { OrganizationMapper } from "../organization.mapper";
import { Organization, OrganizationDocument } from "./organization.schema";
import { OrganizationSchema } from "./organization.schema";
import { OrganizationRepositoryPort } from "./organization.repository.port";

@Injectable()
export class OrganizationRepository
	extends MongoRepositoryBase<OrganizationEntity, OrganizationDocument>
	implements OrganizationRepositoryPort
{
	protected mongoSchema: Schema = OrganizationSchema;
	protected modelName: string = Organization.name;

	constructor(
		@InjectConnection()
		pool: Connection,
		mapper: OrganizationMapper,
		eventEmitter: EventEmitter2,
	) {
		super(pool, mapper, eventEmitter, new Logger(OrganizationRepository.name));
	}

	async findOneByEmail(email: string): Promise<Option<OrganizationEntity>> {
		const mongoModel = this.pool.model(this.modelName, this.mongoSchema);
		const result = await mongoModel.findOne({ email });

		return result ? Some(this.mapper.toDomain(result)) : None;
	}
}
