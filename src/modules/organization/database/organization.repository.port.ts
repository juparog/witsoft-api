import { PaginatedQueryParams, RepositoryPort } from '@witsoft/libs/ddd';
import { OrganizationEntity } from '@witsoft/modules/organization/domain/organization.entity';

export interface FindOrganizationsParams extends PaginatedQueryParams {
  readonly email?: string;
  readonly name?: string;
  readonly workspace?: string;
}

export interface OrganizationRepositoryPort extends RepositoryPort<OrganizationEntity> {
  findOneByEmail(email: string): Promise<OrganizationEntity | null>;
}
