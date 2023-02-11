import { AggregateRoot, AggregateID } from "@witsoft/libs/ddd";
import { uuidv4To12 } from "@witsoft/libs/utils";

import { OrganizationCreatedDomainEvent } from "./events/organization-created.domain-event";
import {
	CreateOrganizationProps,
	OrganizationProps,
} from "./organization.types";

export class OrganizationEntity extends AggregateRoot<OrganizationProps> {
	protected readonly _id: AggregateID;

	static create(
		createOrganizationProps: CreateOrganizationProps,
	): OrganizationEntity {
		const id = uuidv4To12();
		const organizationProps: OrganizationProps = { ...createOrganizationProps };
		const organization = new OrganizationEntity({
			id,
			props: organizationProps,
		});
		organization.addEvent(
			new OrganizationCreatedDomainEvent({
				aggregateId: id,
				email: organizationProps.email,
				name: organizationProps.name,
				password: organizationProps.password,
				workspace: organizationProps.workspace,
			}),
		);
		return organization;
	}

	validate(): void {
		// Validación de reglas de negocio de entidad para proteger antes de guardar entidad en una base de datos
	}
}
