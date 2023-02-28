import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";

import { LoginOrganizationCommand } from "./login-organization.command";
import { LoginOrganizationResponseDto } from "../../dtos";
import { PayloadTokenProps } from "../../domain/auth.types";

@CommandHandler(LoginOrganizationCommand)
export class LoginOrganizationService implements ICommandHandler {
	constructor(private jwtService: JwtService) {}

	async execute(
		command: LoginOrganizationCommand,
	): Promise<LoginOrganizationResponseDto> {
		const payload: PayloadTokenProps = {
			type: "ORGANIZATION",
			id: command.organization.id,
		};

		return new LoginOrganizationResponseDto({
			accessToken: this.jwtService.sign(payload),
		});
	}
}
