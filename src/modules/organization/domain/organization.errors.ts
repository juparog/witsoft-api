import { ExceptionBase } from '@witsoft/libs/exceptions';

export class OrganizationAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Organization already exists';

  public readonly code = 'ORGANIZATION.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(OrganizationAlreadyExistsError.message, cause, metadata);
  }
}
