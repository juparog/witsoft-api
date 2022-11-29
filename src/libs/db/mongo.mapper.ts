import { Model } from 'mongoose';

import { Entity } from '@witsoft/libs/ddd/entity.base';

import {
  MongoModelWithTimestampsProps,
  ValidationErrorDetail,
  ValidationErrors,
  ValidationSubErrors
} from './mongo.types';

export class MongoMapper {
  static toModel(entity: Entity<any>): Model<any> {
    const copy = entity.getPropsCopy();
    const id = copy.id;
    delete copy.id;
    const record = new Model({
      _id: id,
      ...copy
    });
    return record;
  }

  static toObject(record: (Model<any> & MongoModelWithTimestampsProps)): Object {
    const id = record._id;
    delete record._id;
    const obj = {
      id: id,
      ...record
    };
    return obj;
  }

  static validationFormatSubErrors(errors: ValidationErrors): ValidationSubErrors[] {
    const subErrors: ValidationSubErrors[] = Object.keys(errors).map((key: string) => {
      const detail: ValidationErrorDetail = errors[key];
      return {
        field: detail.path,
        message: detail.message,
        type: detail.kind
      }
    });

    return subErrors;
  }
}
