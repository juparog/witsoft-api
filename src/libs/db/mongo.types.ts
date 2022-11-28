export interface MongoModelBaseProps {
  _id: string;
}

export interface MongoModelWithTimestampsProps extends MongoModelBaseProps {
  createdAt: Date;
  updatedAt: Date;
}
