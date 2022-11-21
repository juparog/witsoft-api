import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';

import { AggregateID } from '@witsoft/libs/ddd';
import { ConflictException, InternalServerErrorException } from '@witsoft/libs/exceptions';
import { OrganizationRepositoryPort } from '@witsoft/modules/organization/database/organization.repository.port';
import { OrganizationEntity } from '@witsoft/modules/organization/domain/organization.entity';
import { OrganizationAlreadyExistsError } from '@witsoft/modules/organization/domain/organization.errors';
import { ORGANIZATION_REPOSITORY } from '@witsoft/modules/organization/organization.di-tokens';

import { CreateOrganizationCommand } from './create-organization.command';


@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationService implements ICommandHandler {
	constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    protected readonly organizationRepo: OrganizationRepositoryPort,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<
    Result<AggregateID, OrganizationAlreadyExistsError | InternalServerErrorException>
  > {
		// Agregar mas propiedades necesarias para rear la organizacion, ejemplo un rol de inicio
		const organization = OrganizationEntity.create({
      email: command.email,
      name: command.name,
			password: command.password,
			workspace: command.workspace
    });

		try {
      await this.organizationRepo.transaction(async () => this.organizationRepo.insert(organization));
      return Ok(organization.id);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new OrganizationAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
