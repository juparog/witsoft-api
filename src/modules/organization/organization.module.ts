import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ORGANIZATION_REPOSITORY, ORGANIZATION_SCHEMA } from './organization.di-tokens';
import { OrganizationRepository } from './database/organization.repository';
import { MongooseModule } from '@nestjs/mongoose';

import {
	CreateOrganizationHttpController,
	CreateOrganizationService
} from './commands/create-organization/';

const httpControllers = [
  CreateOrganizationHttpController
];

const commandHandlers: Provider[] = [CreateOrganizationService];

const repositories: Provider[] = [
  { provide: ORGANIZATION_REPOSITORY, useClass: OrganizationRepository },
];

@Module({
	imports: [
    MongooseModule.forFeature([{ name: ORGANIZATION_SCHEMA, schema: UserSchema }]),
    CqrsModule],
  controllers: [...httpControllers],
	providers: [
		Logger,
    ...commandHandlers,
		...repositories
  ],
})
export class OrganizationModule {}
