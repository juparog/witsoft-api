import { Model } from 'mongoose';

import { Entity } from '@witsoft/libs/ddd/entity.base';

import { MongoModelWithTimestampsProps } from './mongo.types';

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
    const obj = {
      id: record._id,
      ...record
    };
    return obj;
  }
}
