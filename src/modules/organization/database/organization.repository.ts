import { Injectable } from '@nestjs/common';
import { model, Schema } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { z } from 'zod';

import { ORGANIZATION_SCHEMA } from '../organization.di-tokens';
import { MongoModelWithTimestampsProps } from '../../../libs/db/mongo.types';

export const organizationSchema = new Schema(
  {
    email: {
      type: String,
      required: 'Please inform the email of the user.',
      unique: 'The email {VALUE} is already registered.',
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
      // trim: true
    },
  },
  {
    collection: ORGANIZATION_SCHEMA,
    timestamps: true
  }
);

organizationSchema.plugin(mongooseUniqueValidator, {
  message: '{PATH} must be unique, {VALUE} is already registered.'
});

export const OrganizationModel =  model(ORGANIZATION_SCHEMA, organizationSchema);

// export type OrganizationModelType =  (typeof OrganizationModel.schema.obj) & MongoModelWithTimestampsProps;
export type OrganizationModelType =  (typeof OrganizationModel & MongoModelWithTimestampsProps);

@Injectable()
export class OrganizationRepository
{
  constructor(
  ) {
  }

	async insert(obj: any): Promise<void> {
		console.log('Organizacion creada correctamente:', obj);
	}

	async transaction<T>(handler: () => Promise<T>): Promise<T> {
		return handler();
	}
}
