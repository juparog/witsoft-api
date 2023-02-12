import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection, Schema } from "mongoose";

import { MongoRepositoryBase } from "@witsoft/libs/db/";

import { OrganizationEntity } from "../domain/organization.entity";
import { OrganizationMapper } from "../organization.mapper";
import { Organization } from "./organization.schema";
import { OrganizationSchema } from "./organization.schema";

@Injectable()
export class OrganizationRepository extends MongoRepositoryBase<
	OrganizationEntity,
	Organization
> {
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
}
