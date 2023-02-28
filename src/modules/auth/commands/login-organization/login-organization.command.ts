import { OrganizationEntity } from "@witsoft/modules/organization/domain/organization.entity";

export class LoginOrganizationCommand {
	constructor(readonly organization: OrganizationEntity) {}
}
