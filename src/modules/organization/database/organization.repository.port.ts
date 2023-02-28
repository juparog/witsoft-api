import { PaginatedQueryParams, RepositoryPort } from "@witsoft/libs/ddd";
import { OrganizationEntity } from "@witsoft/modules/organization/domain/organization.entity";
import { Option } from "oxide.ts";

export interface FindOrganizationsParams extends PaginatedQueryParams {
	readonly email?: string;
	readonly name?: string;
	readonly domain?: string;
}

export interface OrganizationRepositoryPort
	extends RepositoryPort<OrganizationEntity> {
	findOneByEmail(email: string): Promise<Option<OrganizationEntity>>;
}
