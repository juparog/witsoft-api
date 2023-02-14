import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Ok, Result } from "oxide.ts";

import {
	PaginatedParams,
	PaginatedQueryBase,
	Paginated,
} from "@witsoft/libs/ddd/";

import {
	Organization,
	OrganizationDocument,
} from "../../database/organization.schema";
import { PaginateModel } from "mongoose";

export class FindOrganizationsQuery extends PaginatedQueryBase {
	readonly name?: string;
	readonly email?: string;
	readonly domain?: string;

	constructor(props: PaginatedParams<FindOrganizationsQuery>) {
		super(props);
		this.name = props.name;
		this.email = props.email;
		this.domain = props.domain;
	}
}

@QueryHandler(FindOrganizationsQuery)
export class FindOrganizationsQueryHandler implements IQueryHandler {
	constructor(
		@InjectModel(Organization.name)
		private organizationModel: PaginateModel<OrganizationDocument>,
	) {}

	async execute(
		query: FindOrganizationsQuery,
	): Promise<Result<Paginated<OrganizationDocument>, Error>> {
		const filters = {
			name: query.name,
			email: query.email,
			domain: query.domain,
		};

		const result = await this.organizationModel.paginate(
			{ ...filters },
			{
				limit: query.limit,
				offset: query.offset,
				page: query.page,
				sort: query.orderBy,
			},
		);

		return Ok(
			new Paginated({
				data: result.docs,
				count: result.totalDocs,
				limit: result.limit,
				page: result.page,
			}),
		);
	}
}
