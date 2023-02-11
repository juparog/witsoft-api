import { DomainEvent, DomainEventProps } from "@witsoft/libs/ddd";

export class OrganizationCreatedDomainEvent extends DomainEvent {
	readonly email: string;

	readonly name: string;

	readonly password: string;

	readonly workspace: string;

	constructor(props: DomainEventProps<OrganizationCreatedDomainEvent>) {
		super(props);
		this.email = props.email;
		this.name = props.name;
		this.password = props.password;
		this.workspace = props.workspace;
	}
}
