import { Command, CommandProps } from "@witsoft/libs/ddd";
import { PartialUpdateOrganizationRequestDto } from "./partial-update-organization.request.dto";

export class PartialUpdateOrganizationCommand extends Command {
	readonly email?: string;

	readonly name?: string;

	readonly password?: string;

	readonly domain?: string;

	constructor(props: CommandProps<PartialUpdateOrganizationRequestDto>) {
		super(props);
		this.email = props.email;
		this.name = props.name;
		this.password = props.password;
		this.domain = props.domain;
	}
}
