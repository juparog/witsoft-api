import { Command, CommandProps } from "@witsoft/libs/ddd";
import { FullUpdateOrganizationRequestDto } from "./full-update-organization.request.dto";

export class FullUpdateOrganizationCommand extends Command {
	readonly email: string;

	readonly name: string;

	readonly password: string;

	readonly domain: string;

	constructor(props: CommandProps<FullUpdateOrganizationRequestDto>) {
		super(props);
		this.email = props.email;
		this.name = props.name;
		this.password = props.password;
		this.domain = props.domain;
	}
}
