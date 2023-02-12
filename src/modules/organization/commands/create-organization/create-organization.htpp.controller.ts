import {
	Controller,
	Post,
	Body,
	ConflictException as ConflictHttpException,
	BadRequestException as BadRequestHttpException,
	HttpStatus,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { routesV1 } from "@witsoft/config/app.routes";
import { ApiErrorResponse, IdResponse } from "@witsoft/libs/api";
import { AggregateID } from "@witsoft/libs/ddd/";
import {
	BadRequestException,
	InternalServerErrorException,
} from "@witsoft/libs/exceptions/exceptions";
import {
	OrganizationAlreadyExistsError,
	OrganizationUnprocessableError,
} from "@witsoft/modules/organization/domain/organization.errors";

import { CreateOrganizationRequestDto } from "./create-organization.request.dto";
import { CreateOrganizationCommand } from "./create-organization.command";
import { match, Result } from "oxide.ts";
import { validateOrganizationError } from "../../domain/organization.errors";
import { ExceptionBase } from "@witsoft/libs/exceptions";

@ApiTags(`/${routesV1.organization.root}`)
@Controller({
  path: routesV1.organization.root,
  version: routesV1.version
})
export class CreateOrganizationHttpController {
	constructor(private readonly commandBus: CommandBus) {}

	@ApiOperation({ summary: 'Create a organization' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: OrganizationAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: BadRequestException.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: InternalServerErrorException.message,
    type: ApiErrorResponse,
  })
  @Post()
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
					validateOrganizationError(error);
				}
				throw error;
			},
		});
	}
}
