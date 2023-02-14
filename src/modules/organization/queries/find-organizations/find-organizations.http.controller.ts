import { Body, Controller, Get, Query } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Result } from "oxide.ts";

import { routesV1 } from "@witsoft/config/app.routes";
import { ApiErrorResponse, PaginatedQueryRequestDto, ResponseBase } from "@witsoft/libs/api";
import { Paginated } from "@witsoft/libs/ddd";
import { BadRequestException, InternalServerErrorException } from "@witsoft/libs/exceptions";

import { FindOrganizationsRequestDto } from "./find-organizations.request.dto";
import { FindOrganizationsQuery } from "./find-organizations.query-handler";
import { OrganizationPaginatedResponseDto } from "../../dtos";
import { OrganizationDocument } from "../../database/organization.schema";

@ApiTags(`/${routesV1.organization.root}`)
@Controller({
  version: routesV1.version
})
export class FindOrganizationsHttpController {
	constructor(private readonly queryBus: QueryBus) {}

	@ApiOperation({ summary: 'Find organizations' })
  @ApiOkResponse({ type: OrganizationPaginatedResponseDto })
  @ApiBadRequestResponse({
		description: BadRequestException.message,
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
		description: InternalServerErrorException.message,
    type: ApiErrorResponse,
  })
  @Get(routesV1.organization.root)
	async findOrganizations(
		@Body() request: FindOrganizationsRequestDto,
		@Query() queryParams: PaginatedQueryRequestDto,
	): Promise<OrganizationPaginatedResponseDto> {
		const query = new FindOrganizationsQuery({
			...request,
			limit: queryParams?.limit,
			page: queryParams?.page,
			orderBy: queryParams?.orderBy,
		});
		const result: Result<
			Paginated<OrganizationDocument>,
			Error
		> = await this.queryBus.execute(query);

		const paginated = result.unwrap();

		return new OrganizationPaginatedResponseDto({
			...paginated,
			data: paginated.data.map((organization) => ({
				...new ResponseBase({
					id: organization.toObject()._id,
					...organization.toObject(),
				}),
				name: organization.name,
				email: organization.email,
				domain: organization.domain,
			})),
		});
	}
}
