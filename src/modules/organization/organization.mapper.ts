import { Injectable } from '@nestjs/common';

import { Mapper } from '@witsoft/libs/ddd';
import { Types as MongoTypes } from 'mongoose';

import { OrganizationModelType } from './database/organization.repository';
import { OrganizationEntity } from './domain/organization.entity';
import { OrganizationResponseDto } from './dtos/organization.response.dto';

@Injectable()
export class OrganizationMapper
  implements Mapper<OrganizationEntity, OrganizationModelType, OrganizationResponseDto>
{
  toPersistence(entity: OrganizationEntity): OrganizationModelType {
    const copy = entity.getPropsCopy();
    const record: OrganizationModelType = {
      _id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      email: copy.email,
      name: copy.name,
      password: copy.password,
      workspace: copy.workspace
    };
    return record;
  }

  toDomain(record: OrganizationModelType): OrganizationEntity {
    const entity = new OrganizationEntity({
      id: record._id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        email: record.email.toString(),
        name: record.name.toString(),
        password: record.password.toString(),
        workspace: record.workspace.toString()
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
