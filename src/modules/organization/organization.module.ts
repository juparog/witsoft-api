import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import { ORGANIZATION_REPOSITORY } from './organization.di-tokens';
import { OrganizationRepository, organizationSchema } from './database/organization.repository';
import { ORGANIZATION_MODEL_NAME } from './database/organization-constants.repository';
import { OrganizationMapper } from './organization.mapper';

import {
	CreateOrganizationHttpController,
	CreateOrganizationService
} from './commands/create-organization/';

const httpControllers = [
  CreateOrganizationHttpController
];

const commandHandlers: Provider[] = [CreateOrganizationService];

const mappers: Provider[] = [OrganizationMapper];

const repositories: Provider[] = [
  { provide: ORGANIZATION_REPOSITORY, useClass: OrganizationRepository },
];

@Module({
	imports: [
    MongooseModule.forFeature([{ name: ORGANIZATION_MODEL_NAME, schema: organizationSchema }]),
    CqrsModule],
  controllers: [...httpControllers],
	providers: [
		Logger,
    ...commandHandlers,
		...repositories,
    ...mappers
  ],
})
export class OrganizationModule {}
