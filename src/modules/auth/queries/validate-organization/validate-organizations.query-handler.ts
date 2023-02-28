import { Inject } from "@nestjs/common";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Result, Ok, Err } from "oxide.ts";

import { OrganizationRepositoryPort } from "@witsoft/modules/organization/database/organization.repository.port";
import { ORGANIZATION_REPOSITORY } from "@witsoft/modules/organization/organization.di-tokens";
import { OrganizationEntity } from "@witsoft/modules/organization/domain/organization.entity";
import { Password } from "@witsoft/libs/utils/password.utils";

import { AuthUnauthorizedEntityError } from "../../domain/auth.errors";

export class ValidateOrganizationQuery {
	readonly email: string;
	readonly password: string;

	constructor(props: ValidateOrganizationQuery) {
		this.email = props.email;
		this.password = props.password;
	}
}

@QueryHandler(ValidateOrganizationQuery)
export class ValidateOrganizationQueryHandler implements IQueryHandler {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY)
		protected readonly organizationRepo: OrganizationRepositoryPort,
	) {}

	async execute(
		query: ValidateOrganizationQuery,
	): Promise<Result<OrganizationEntity, Error>> {
		const organizationOption = await this.organizationRepo.findOneByEmail(
			query.email,
		);
		const organization = organizationOption.unwrapOr(undefined);

		if (organization) {
			const organizationProps = organization.getPropsCopy();
			const pass = new Password(query.password);
			if (pass.equals(organizationProps.password)) {
				return Ok(organization);
			}
		}

		return Err(new AuthUnauthorizedEntityError());
	}
}
