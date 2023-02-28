import { Controller, Put, Body, Param, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { match, Result } from "oxide.ts";

import { routesV1 } from "@witsoft/config/app.routes";
import { ApiErrorResponse, IdResponse, ResponseBase } from "@witsoft/libs/api";
import { AggregateID } from "@witsoft/libs/ddd/";
import {
	BadRequestException,
	InternalServerErrorException,
} from "@witsoft/libs/exceptions/exceptions";
import { OrganizationErrorHandler } from "@witsoft/modules/organization/domain/organization.errors";
import { ExceptionBase } from "@witsoft/libs/exceptions";
import { ParseMongoIdPipe } from "@witsoft/libs/application/pipes/parse-mongo-id.pipe";
import { OrganizationEntity } from "@witsoft/modules/organization/domain/organization.entity";

import { FullUpdateOrganizationRequestDto } from "./full-update-organization.request.dto";
import { FullUpdateOrganizationCommand } from "./full-update-organization.command";
import { OrganizationNotFoundError } from "../../domain/organization.errors";
import { OrganizationResponseDto } from "../../dtos/organization.response.dto";
import { OrganizationMapper } from "../../organization.mapper";
import { JwtAuthGuard } from "@witsoft/libs/application/guards/jwt-auth.guard";

@ApiTags(`/${routesV1.organization.root}`)
@Controller({
  version: routesV1.version
})
export class FullUpdateOrganizationHttpController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly mapper: OrganizationMapper,
	) {}

	@ApiOperation({ summary: 'Full replacement of an organization properties by id' })
  @ApiOkResponse({ type: OrganizationResponseDto })
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
  @UseGuards(JwtAuthGuard)
  @Put(routesV1.organization.fullUpdate)
	async fullUpdate(
		@Body() fullUpdateOrganizationRequestDto: FullUpdateOrganizationRequestDto,
		@Param('id', ParseMongoIdPipe) id: string,
	): Promise<OrganizationResponseDto> {
		const command = new FullUpdateOrganizationCommand({
			id: id,
			...fullUpdateOrganizationRequestDto,
		});

		const result: Result<OrganizationEntity, Error> =
			await this.commandBus.execute(command);

		return match(result, {
			Ok: (organization: OrganizationEntity) =>
				this.mapper.toResponse(organization),
			Err: (error: Error) => {
				if (error instanceof ExceptionBase) {
					OrganizationErrorHandler.validateOrganizationError(error);
				}
				throw error;
			},
		});
	}
}
