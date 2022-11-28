import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Mapper } from '@witsoft/libs/ddd';

import { OrganizationModelType } from './database/organization.repository';
import { OrganizationEntity } from './domain/organization.entity';
import { OrganizationResponseDto } from './dtos/organization.response.dto';

@Injectable()
export class OrganizationMapper
  implements Mapper<OrganizationEntity, OrganizationModelType, OrganizationResponseDto>
{
  toPersistence(entity: OrganizationEntity): OrganizationModelType {
    const copy = entity.getPropsCopy();
    const record: OrganizationModelType = new Model({
      _id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      email: copy.email,
      name: copy.name,
      password: copy.password,
      workspace: copy.workspace
    });
    return record;
  }

  toDomain(record: OrganizationModelType): OrganizationEntity {
    const entity = new OrganizationEntity({
      id: record._id,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      props: {
        email: record.schema.obj.email.toString(),
        name: record.schema.obj.name.toString(),
        password: record.schema.obj.password.toString(),
        workspace: record.schema.obj.workspace.toString()
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
