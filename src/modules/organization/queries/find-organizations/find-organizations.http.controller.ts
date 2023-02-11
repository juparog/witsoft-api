import { Body, Controller, Get, HttpStatus, Query } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Result } from "oxide.ts";

import { routesV1 } from "@witsoft/config/app.routes";
import { PaginatedQueryRequestDto, ResponseBase } from "@witsoft/libs/api";
import { Paginated } from "@witsoft/libs/ddd";

import { FindOrganizationsRequestDto } from "./find-organizations.request.dto";
import { FindOrganizationsQuery } from "./find-organizations.query-handler";
import { OrganizationMapper } from "../../organization.mapper";
import { OrganizationPaginatedResponseDto } from "../../dtos/organization.paginated.response.dto";
import { OrganizationDocument } from "../../database/organization.schema";

@ApiTags(`/${routesV1.organization.root}`)
@Controller({
  path: routesV1.organization.root,
  version: routesV1.version
})
export class FindOrganizationsHttpController {
	constructor(
		private readonly queryBus: QueryBus,
	) {}

	@ApiOperation({ summary: 'Find organizations' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: OrganizationPaginatedResponseDto,
  })
  @Get()
	async findOrganizations(
		@Body() request: FindOrganizationsRequestDto,
		@Query() queryParams: PaginatedQueryRequestDto,
	): Promise<OrganizationPaginatedResponseDto> {

		const query = new FindOrganizationsQuery({
			...request,
			limit: queryParams?.limit,
			page: queryParams?.page,
      orderBy: queryParams?.orderBy
		});
		const result: Result<
			Paginated<OrganizationDocument>,
			Error
		> = await this.queryBus.execute(query);

		const paginated = result.unwrap();

		return new OrganizationPaginatedResponseDto({
			...paginated,
			data: paginated.data.map((organization) => ({
				...new ResponseBase(organization.toObject()),
				name: organization.name,
				email: organization.email,
				workspace: organization.workspace,
			})),
		});
	}
}
