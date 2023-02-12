import { Logger, Module, Provider } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";

import { ORGANIZATION_REPOSITORY } from "./organization.di-tokens";
import { OrganizationRepository } from "./database/organization.repository";
import { OrganizationMapper } from "./organization.mapper";
import { FindOrganizationsHttpController } from "./queries/find-organizations/find-organizations.http.controller";
import { FindOrganizationsQueryHandler } from "./queries/find-organizations/find-organizations.query-handler";
import {
	Organization,
	OrganizationSchema,
} from "./database/organization.schema";

import {
	CreateOrganizationHttpController,
	CreateOrganizationService,
} from "./commands/create-organization/";

const httpControllers = [
	FindOrganizationsHttpController,
	CreateOrganizationHttpController,
];
const commandHandlers: Provider[] = [CreateOrganizationService];
const queryHandlers: Provider[] = [FindOrganizationsQueryHandler];
const mappers: Provider[] = [OrganizationMapper];
const repositories: Provider[] = [
	{ provide: ORGANIZATION_REPOSITORY, useClass: OrganizationRepository },
];

@Module({
	imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema }
    ]),
    CqrsModule
  ],
  controllers: [...httpControllers],
	providers: [
		Logger,
    ...commandHandlers,
    ...queryHandlers,
		...repositories,
    ...mappers
  ],
})
export class OrganizationModule {}
