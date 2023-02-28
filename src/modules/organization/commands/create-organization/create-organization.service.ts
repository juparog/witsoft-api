import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Err, Ok, Result } from "oxide.ts";

import { AggregateID } from "@witsoft/libs/ddd";
import {
	ConflictException,
	UnprocessableEntityException,
	InternalServerErrorException,
} from "@witsoft/libs/exceptions";
import { OrganizationRepositoryPort } from "@witsoft/modules/organization/database/organization.repository.port";
import { OrganizationEntity } from "@witsoft/modules/organization/domain/organization.entity";
import {
	OrganizationAlreadyExistsError,
	OrganizationUnprocessableError,
} from "@witsoft/modules/organization/domain/organization.errors";
import { ORGANIZATION_REPOSITORY } from "@witsoft/modules/organization/organization.di-tokens";
import { Password } from "@witsoft/libs/utils/password.utils";

import { CreateOrganizationCommand } from "./create-organization.command";

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationService implements ICommandHandler {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY)
		protected readonly organizationRepo: OrganizationRepositoryPort,
	) {}

	async execute(
		command: CreateOrganizationCommand,
	): Promise<Result<AggregateID, Error>> {
		// Agregar mas propiedades necesarias para crear la organizacion, ejemplo un rol de inicio
		const pass = new Password(command.password);
		const organization = OrganizationEntity.create({
			email: command.email,
			name: command.name,
			password: pass.hashed(),
			domain: command.domain,
		});

		try {
			await this.organizationRepo.transaction(async (session) => {
				await this.organizationRepo.insert(organization, { session });
			});
			return Ok(organization.id);
		} catch (error) {
			if (error instanceof UnprocessableEntityException) {
				return Err(new OrganizationUnprocessableError(error, error.metadata));
			}
			if (error instanceof ConflictException) {
				return Err(new OrganizationAlreadyExistsError(error, error.metadata));
			}
			throw Err(error);
		}
	}
}
