import { Injectable } from "@nestjs/common";

import { Mapper } from "@witsoft/libs/ddd";
import { Types as MongoTypes } from "mongoose";

import { OrganizationEntity } from "./domain/organization.entity";
import { OrganizationResponseDto } from "./dtos/organization.response.dto";
import {
	OrganizationDocument,
	Organization,
} from "./database/organization.schema";

@Injectable()
export class OrganizationMapper
	implements Mapper<OrganizationEntity, Organization, OrganizationResponseDto>
{
	toPersistence(entity: OrganizationEntity): Organization {
		const copy = entity.getPropsCopy();
		const record: Organization = {
			email: copy.email,
			name: copy.name,
			password: copy.password,
			workspace: copy.workspace,
			createdAt: copy.createdAt,
			updatedAt: copy.updatedAt,
		};
		return record;
	}

	toDomain(record: OrganizationDocument): OrganizationEntity {
		const entity = new OrganizationEntity({
			id: record._id.toString(),
			createdAt: new Date(record.createdAt),
			updatedAt: new Date(record.updatedAt),
			props: {
				email: record.email.toString(),
				name: record.name.toString(),
				password: record.password.toString(),
				workspace: record.workspace.toString(),
			},
		});
		return entity;
	}

	toResponse(entity: OrganizationEntity): OrganizationResponseDto {
		const props = entity.getPropsCopy();
		const response = new OrganizationResponseDto(entity);
		response.email = props.email;
		response.name = props.name;
		response.workspace = props.workspace;
		return response;
	}
}
