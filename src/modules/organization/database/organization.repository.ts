import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model, model, Schema } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

import { MongoModelWithTimestampsProps, MongoRepositoryBase } from '@witsoft/libs/db/';

import { ORGANIZATION_MODEL_NAME } from './organization-constants.repository';
import { OrganizationEntity } from '../domain/organization.entity';
import { OrganizationMapper } from '../organization.mapper';

export const organizationSchema = new Schema(
  {
    email: {
      type: String,
      required: 'Please inform the email of the user.',
      unique: 'The {PATH} {VALUE} is already registered.',
      validate: {
        validator: (email) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email),
        message: 'The email {VALUE} does not comply with the allowed format.'
      }
    },
    name: {
      type: String,
      required: 'Please provide the name for the organization.',
      // trim: true
    },
    password: {
      type: String,
      // allowNull: false,
      required: 'Please, inform the password of the organization.',
    },
    workspace: {
      type: String,
      required: 'Please provide the workspace for the organization.',
      unique: 'The {PATH} {VALUE} is already registered.',
      // trim: true
    },
  },
  {
    collection: ORGANIZATION_MODEL_NAME,
    timestamps: true
  }
);

organizationSchema.plugin(mongooseUniqueValidator, {
  message: '{PATH} must be unique, {VALUE} is already registered.'
});

export const OrganizationModel =  model(ORGANIZATION_MODEL_NAME, organizationSchema);

export type OrganizationModelType =  (typeof OrganizationModel.schema.obj) & MongoModelWithTimestampsProps;

@Injectable()
export class OrganizationRepository
  extends MongoRepositoryBase<OrganizationEntity, OrganizationModelType>
{
  protected mongoSchema: Schema = organizationSchema;

  protected modelName: string = ORGANIZATION_MODEL_NAME;

  constructor(
    @InjectConnection()
    pool: Connection,
    mapper: OrganizationMapper,
    eventEmitter: EventEmitter2,
  ) {
    super(pool, mapper, eventEmitter, new Logger(OrganizationRepository.name));
  }

}
