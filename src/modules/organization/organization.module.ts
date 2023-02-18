import { Logger, Module, Provider } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";

import { ORGANIZATION_REPOSITORY } from "./organization.di-tokens";
import { OrganizationRepository } from "./database/organization.repository";
import { OrganizationMapper } from "./organization.mapper";
import { FindOrganizationsHttpController } from "./queries/find-organizations/find-organizations.http.controller";
import { FindOrganizationsQueryHandler } from "./queries/find-organizations/find-organizations.query-handler";
import { FindOrganizationByIdHttpController } from "./queries/find-organization-by-id/find-organization-by-id.http.controller";
import { FindOrganizationByIdQueryHandler } from "./queries/find-organization-by-id/find-organization-by-id.query-handler";
import { FullUpdateOrganizationHttpController } from "./commands/full-update-organization/full-update-organization.htpp.controller";
import { FullUpdateOrganizationService } from "./commands/full-update-organization/full-update-organization.service";
import { PartialUpdateOrganizationService } from "./commands/partial-update-organization/partial-update-organization.service";
import { PartialUpdateOrganizationHttpController } from "./commands/partial-update-organization/partial-update-organization.htpp.controller";
import {
	Organization,
	OrganizationSchema,
} from "./database/organization.schema";

import {
	CreateOrganizationHttpController,
	CreateOrganizationService,
} from "./commands/create-organization/";

const httpControllers = [
	FindOrganizationByIdHttpController,
	FindOrganizationsHttpController,
	FullUpdateOrganizationHttpController,
	PartialUpdateOrganizationHttpController,
	CreateOrganizationHttpController,
];

const commandHandlers: Provider[] = [
	CreateOrganizationService,
	FullUpdateOrganizationService,
	PartialUpdateOrganizationService,
];

const queryHandlers: Provider[] = [
	FindOrganizationsQueryHandler,
	FindOrganizationByIdQueryHandler,
];

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
