import { Controller, Get, HttpStatus, Param } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import {
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { Result, match } from "oxide.ts";

import { routesV1 } from "@witsoft/config/app.routes";
import { ParseMongoIdPipe } from "@witsoft/libs/application/pipes/parse-mongo-id.pipe";
import { ApiErrorResponse } from "@witsoft/libs/api";
import { ExceptionBase } from "@witsoft/libs/exceptions/exception.base";

import { FindOrganizationByIdQuery } from "./find-organization-by-id.query-handler";
import { OrganizationResponseDto } from "../../dtos";
import { OrganizationDocument } from "../../database/organization.schema";
import {
	OrganizationNotFoundError,
	OrganizationErrorHandler,
} from "../../domain/organization.errors";
import {
	BadRequestException,
	InternalServerErrorException,
} from "@witsoft/libs/exceptions";

@ApiTags(`/${routesV1.organization.root}`)
@Controller({
  version: routesV1.version
})
export class FindOrganizationByIdHttpController {
	constructor(private readonly queryBus: QueryBus) {}

	@ApiOperation({ summary: 'Find organization by id' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: OrganizationResponseDto,
  })
  @ApiBadRequestResponse({
		description: BadRequestException.message,
    type: ApiErrorResponse,
  })
  @ApiNotFoundResponse({
    description: OrganizationNotFoundError.message,
    type: ApiErrorResponse
  })
  @ApiInternalServerErrorResponse({
    description: InternalServerErrorException.message,
    type: ApiErrorResponse,
  })
  @Get(routesV1.organization.findById)
	async findOrganization(
		@Param('id', ParseMongoIdPipe) id: string,
	): Promise<OrganizationResponseDto> {
		const query = new FindOrganizationByIdQuery(id);
		const result: Result<OrganizationDocument, Error> =
			await this.queryBus.execute(query);

		return match(result, {
			Ok: (organizationDocument: OrganizationDocument) => {
				const organization = new OrganizationResponseDto({
					id: organizationDocument.toObject()._id.toString(),
					createdAt: organizationDocument.toObject().createdAt,
					updatedAt: organizationDocument.toObject().updatedAt,
				});
				organization.name = organizationDocument.toObject().name;
				organization.email = organizationDocument.toObject().email;
				organization.domain = organizationDocument.toObject().domain;

				return organization;
			},
			Err: (error: Error) => {
				if (error instanceof ExceptionBase) {
					OrganizationErrorHandler.validateOrganizationError(error);
				}
				throw error;
			},
		});
	}
}
