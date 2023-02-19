import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ok, Result, Err } from "oxide.ts";

import {
	Organization,
	OrganizationDocument,
} from "../../database/organization.schema";
import { OrganizationNotFoundError } from "../../domain/organization.errors";

export class FindOrganizationByIdQuery {
	readonly id: string;

	constructor(id: string) {
		this.id = id;
	}
}

@QueryHandler(FindOrganizationByIdQuery)
export class FindOrganizationByIdQueryHandler implements IQueryHandler {
	constructor(
		@InjectModel(Organization.name)
		private organizationModel: Model<OrganizationDocument>,
	) {}

	async execute(
		query: FindOrganizationByIdQuery,
	): Promise<Result<OrganizationDocument, Error>> {
		const result: OrganizationDocument = await this.organizationModel.findById(
			query.id,
		);

		if (!result) {
			return Err(new OrganizationNotFoundError());
		}

		return Ok(result);
	}
}
