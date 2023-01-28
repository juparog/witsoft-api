import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';

import { AggregateID } from '@witsoft/libs/ddd';
import { UnprocessableEntityException, InternalServerErrorException } from '@witsoft/libs/exceptions';
import { OrganizationRepositoryPort } from '@witsoft/modules/organization/database/organization.repository.port';
import { OrganizationEntity } from '@witsoft/modules/organization/domain/organization.entity';
import {
  OrganizationAlreadyExistsError,
  OrganizationUnprocessableError
} from '@witsoft/modules/organization/domain/organization.errors';
import { ORGANIZATION_REPOSITORY } from '@witsoft/modules/organization/organization.di-tokens';

import { CreateOrganizationCommand } from './create-organization.command';


@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationService implements ICommandHandler {
	constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    protected readonly organizationRepo: OrganizationRepositoryPort,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<
    Result<
      AggregateID,
      OrganizationAlreadyExistsError |
      OrganizationUnprocessableError |
      InternalServerErrorException
    >
  > {
		// Agregar mas propiedades necesarias para crear la organizacion, ejemplo un rol de inicio
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
      if (error instanceof UnprocessableEntityException) {
        const errorMetadata: any = error.metadata;
        const hasUniqueConstraint = errorMetadata.subErrors ?
          errorMetadata.subErrors.some(subError => subError.type === 'unique')
          : false;
        if (hasUniqueConstraint) {
          return Err(new OrganizationAlreadyExistsError(error));
        }
        return Err(new OrganizationUnprocessableError(error));
      }
      throw error;
    }
  }
}
