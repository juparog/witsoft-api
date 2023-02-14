import { Controller, Post, Body } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { match, Result } from "oxide.ts";

import { routesV1 } from "@witsoft/config/app.routes";
import { ApiErrorResponse, IdResponse } from "@witsoft/libs/api";
import { AggregateID } from "@witsoft/libs/ddd/";
import {
	BadRequestException,
	InternalServerErrorException,
} from "@witsoft/libs/exceptions/exceptions";
import {
	OrganizationAlreadyExistsError,
	OrganizationErrorHandler,
	OrganizationUnprocessableError,
} from "@witsoft/modules/organization/domain/organization.errors";
import { ExceptionBase } from "@witsoft/libs/exceptions";

import { CreateOrganizationRequestDto } from "./create-organization.request.dto";
import { CreateOrganizationCommand } from "./create-organization.command";

@ApiTags(`/${routesV1.organization.root}`)
@Controller({
  version: routesV1.version
})
export class CreateOrganizationHttpController {
	constructor(private readonly commandBus: CommandBus) {}

	@ApiOperation({ summary: 'Create a organization' })
  @ApiCreatedResponse({ type: IdResponse })
  @ApiConflictResponse({
    description: OrganizationAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @ApiBadRequestResponse({
		description: BadRequestException.message,
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
		description: InternalServerErrorException.message,
    type: ApiErrorResponse,
  })
  @Post(routesV1.organization.root)
	async create(
		@Body() createOrganizationRequestDto: CreateOrganizationRequestDto,
	): Promise<IdResponse> {
		const command = new CreateOrganizationCommand(createOrganizationRequestDto);

		const result: Result<
			AggregateID,
			OrganizationAlreadyExistsError | OrganizationUnprocessableError
		> = await this.commandBus.execute(command);

		return match(result, {
			Ok: (id: string) => new IdResponse(id),
			Err: (error: Error) => {
				if (error instanceof ExceptionBase) {
					OrganizationErrorHandler.validateOrganizationError(error);
				}
				throw error;
			},
		});
	}
}
