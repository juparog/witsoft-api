import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { CommandBus } from "@nestjs/cqrs";

import { routesV1 } from "@witsoft/config/app.routes";
import {
	BadRequestException,
	InternalServerErrorException,
} from "@witsoft/libs/exceptions/exceptions";
import { ApiErrorResponse } from "@witsoft/libs/api";
import { OrganizationLocalAuthGuard } from "@witsoft/libs/application/guards/organization-local-auth.guard";

import { LoginOrganizationResponseDto } from "../../dtos/login-organization.response.dto";
import { LoginOrganizationCommand } from "./login-organization.command";
import {
	AuthUnauthorizedEntityError,
	AuthForbiddenResourceError,
} from "../../domain/auth.errors";

@ApiTags(`/${routesV1.auth.root}`)
@Controller({
  version: routesV1.version
})
export class LoginOrganizationHttpController {
	constructor(private readonly commandBus: CommandBus) {}

	@ApiOperation({ summary: 'Login a organization' })
  @ApiOkResponse({ type: LoginOrganizationResponseDto })
  @ApiBadRequestResponse({
		description: BadRequestException.message,
    type: ApiErrorResponse,
  })
  @ApiUnauthorizedResponse({
    description: AuthUnauthorizedEntityError.message,
    type: ApiErrorResponse
  })
  @ApiForbiddenResponse({
    description: AuthForbiddenResourceError.message,
    type: ApiErrorResponse
  })
  @ApiInternalServerErrorResponse({
		description: InternalServerErrorException.message,
    type: ApiErrorResponse,
  })
  @UseGuards(OrganizationLocalAuthGuard)
  @Post(routesV1.auth.loginOrganization)
	async login(
		@Request() req,
	): Promise<LoginOrganizationResponseDto> {
		const command = new LoginOrganizationCommand(req.user);
		const result = await this.commandBus.execute(command);

		return result;
	}
}
