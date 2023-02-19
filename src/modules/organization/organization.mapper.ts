import { Injectable } from "@nestjs/common";

import { Mapper } from "@witsoft/libs/ddd";

import { OrganizationEntity } from "./domain/organization.entity";
import { OrganizationResponseDto } from "./dtos/organization.response.dto";
import {
	OrganizationDocument,
	OrganizationModel,
} from "./database/organization.schema";
import { Types } from "mongoose";

@Injectable()
export class OrganizationMapper
	implements
		Mapper<OrganizationEntity, OrganizationDocument, OrganizationResponseDto>
{
	toPersistence(entity: OrganizationEntity): OrganizationDocument {
		const copy = entity.getPropsCopy();
		const record = new OrganizationModel({
			email: copy.email,
			name: copy.name,
			password: copy.password,
			domain: copy.domain,
			createdAt: copy.createdAt,
			updatedAt: copy.updatedAt,
		});
		record._id = new Types.ObjectId(entity.id);
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
				domain: record.domain.toString(),
			},
		});
		return entity;
	}

	toResponse(entity: OrganizationEntity): OrganizationResponseDto {
		const props = entity.getPropsCopy();
		const response = new OrganizationResponseDto(entity);
		response.email = props.email;
		response.name = props.name;
		response.domain = props.domain;
		return response;
	}
}
