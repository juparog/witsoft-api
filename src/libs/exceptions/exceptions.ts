import {
  ARGUMENT_INVALID,
  ARGUMENT_NOT_PROVIDED,
  ARGUMENT_OUT_OF_RANGE,
	BAD_REQUEST,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from '.';
import { ExceptionBase } from './exception.base';

/**
 * Se utiliza para indicar que se proporcionó un argumento incorrecto a un constructor de método/función/clase
 *
 * @class ArgumentInvalidException
 * @extends {ExceptionBase}
 */
export class ArgumentInvalidException extends ExceptionBase {
  readonly code = ARGUMENT_INVALID;
}

/**
 * Se utiliza para indicar que no se proporcionó un argumento (es objeto vacío/matriz, nulo o indefinido).
 *
 * @class ArgumentNotProvidedException
 * @extends {ExceptionBase}
 */
export class ArgumentNotProvidedException extends ExceptionBase {
  readonly code = ARGUMENT_NOT_PROVIDED;
}

/**
 * Se usa para indicar que un argumento está fuera del rango permitido
 * (por ejemplo: longitud incorrecta de cadena/matriz, número no permitido en rango mínimo/máximo, etc.)
 *
 * @class ArgumentOutOfRangeException
 * @extends {ExceptionBase}
 */
export class ArgumentOutOfRangeException extends ExceptionBase {
  readonly code = ARGUMENT_OUT_OF_RANGE;
}

/**
 * Se utiliza para indicar entidades en conflicto (normalmente en la base de datos)
 *
 * @class ConflictException
 * @extends {ExceptionBase}
 */
export class ConflictException extends ExceptionBase {
  readonly code = CONFLICT;
}

/**
 * Se utiliza para indicar que no se encuentra la entidad
 *
 * @class NotFoundException
 * @extends {ExceptionBase}
 */
export class NotFoundException extends ExceptionBase {
  static readonly message = 'Not found';

  constructor(message = NotFoundException.message) {
    super(message);
  }

  readonly code = NOT_FOUND;
}

/**
 * Se utiliza para indicar que la solicitud no tiene los argumentos adecuados
 *
 * @class BadRequestException
 * @extends {ExceptionBase}
 */
export class BadRequestException extends ExceptionBase {
  static readonly message = 'Bad request';

  constructor(message = BadRequestException.message) {
    super(message);
  }

  readonly code = BAD_REQUEST;
}

/**
 * un error interno del servidor del que se desconoce su detalle
 *
 * @class NotFoundException
 * @extends {ExceptionBase}
 */
export class InternalServerErrorException extends ExceptionBase {
  static readonly message = 'Internal server error';

  constructor(message = InternalServerErrorException.message) {
    super(message);
  }

  readonly code = INTERNAL_SERVER_ERROR;
}
