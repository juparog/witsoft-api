import { Injectable, Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { QueryBus } from "@nestjs/cqrs";
import { Strategy } from "passport-local";
import { Result, match } from "oxide.ts";

import { ORGANIZATION_REPOSITORY } from "@witsoft/modules/organization/organization.di-tokens";
import { OrganizationRepositoryPort } from "@witsoft/modules/organization/database/organization.repository.port";
import { OrganizationEntity } from "@witsoft/modules/organization/domain/organization.entity";
import { ExceptionBase } from "@witsoft/libs/exceptions/exception.base";

import { AuthnErrorHandler } from "../domain/auth.errors";
import { ValidateOrganizationQuery } from "../queries/validate-organization/validate-organizations.query-handler";

@Injectable()
export class LocalStrategy extends PassportStrategy(
	Strategy,
	"organization-local",
) {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY)
		protected readonly organizationRepo: OrganizationRepositoryPort,
		private readonly queryBus: QueryBus,
	) {
		super({ usernameField: "email" });
	}

	async validate(email: string, password: string): Promise<OrganizationEntity> {
		const query = new ValidateOrganizationQuery({ email, password });

		const result: Result<OrganizationEntity, Error> =
			await this.queryBus.execute(query);

		return match(result, {
			Ok: (organization: OrganizationEntity) => organization,
			Err: (error: Error) => {
				if (error instanceof ExceptionBase) {
					AuthnErrorHandler.validateOrganizationError(error);
				}
				throw error;
			},
		});
	}
}
