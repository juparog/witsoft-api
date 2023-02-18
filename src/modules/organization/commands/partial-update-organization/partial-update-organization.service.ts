import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Err, Ok, Result } from "oxide.ts";

import { InternalServerErrorException } from "@witsoft/libs/exceptions";
import { OrganizationRepositoryPort } from "@witsoft/modules/organization/database/organization.repository.port";
import { OrganizationEntity } from "@witsoft/modules/organization/domain/organization.entity";
import { OrganizationNotFoundError } from "@witsoft/modules/organization/domain/organization.errors";
import { ORGANIZATION_REPOSITORY } from "@witsoft/modules/organization/organization.di-tokens";

import { PartialUpdateOrganizationCommand } from "./partial-update-organization.command";

@CommandHandler(PartialUpdateOrganizationCommand)
export class PartialUpdateOrganizationService implements ICommandHandler {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY)
		protected readonly organizationRepo: OrganizationRepositoryPort,
	) {}

	async execute(
		command: PartialUpdateOrganizationCommand,
	): Promise<Result<OrganizationEntity, Error>> {
		try {
			const organizationOptional = await this.organizationRepo.findOneById(
				command.id,
			);
			const currentOrganization = organizationOptional.unwrapOr(undefined);

			if (!currentOrganization) {
				return Err(new OrganizationNotFoundError());
			}

			const updatedOrganization = new OrganizationEntity({
				id: currentOrganization.id,
				createdAt: currentOrganization.createdAt,
				updatedAt: new Date(),
				props: {
					name: command.name,
					email: command.email,
					password: command.password,
					domain: command.domain,
				},
			});

			const result = await this.organizationRepo.transaction(
				async (session) => {
					const result = await this.organizationRepo.findByIdAndUpdate(
						command.id,
						updatedOrganization,
						session,
					);
					return result.unwrap();
				},
			);

			return Ok(result);
		} catch (error) {
			throw Err(error);
		}
	}
}
