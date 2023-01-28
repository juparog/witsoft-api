export interface MongoModelBaseProps {
  _id: string;
}

export interface MongoModelWithTimestampsProps extends MongoModelBaseProps {
  createdAt: Date;
  updatedAt: Date;
}

export interface ValidationErrors {
  [path: string]: ValidationErrorDetail;
}

export interface ValidationErrorDetail {
  name:       string;
  message:    string;
  kind:       string;
  path:       string;
  value:      string;
}

export interface ValidationSubErrors {
  field:      string;
  message:    string;
  type:       string;
}
