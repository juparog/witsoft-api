import { Controller, Body, Param, Patch } from "@nestjs/common";
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

import { PartialUpdateOrganizationRequestDto } from "./partial-update-organization.request.dto";
import { PartialUpdateOrganizationCommand } from "./partial-update-organization.command";
import { OrganizationNotFoundError } from "../../domain/organization.errors";
import { OrganizationResponseDto } from "../../dtos/organization.response.dto";
import { OrganizationMapper } from "../../organization.mapper";

@ApiTags(`/${routesV1.organization.root}`)
@Controller({
  version: routesV1.version
})
export class PartialUpdateOrganizationHttpController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly mapper: OrganizationMapper,
	) {}

	@ApiOperation({ summary: 'Partial replacement of an organization properties by id.' })
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
  @Patch(routesV1.organization.fullUpdate)
	async fullUpdate(
		@Body() fullUpdateOrganizationRequestDto: PartialUpdateOrganizationRequestDto,
		@Param('id', ParseMongoIdPipe) id: string,
	): Promise<OrganizationResponseDto> {
		const command = new PartialUpdateOrganizationCommand({
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
