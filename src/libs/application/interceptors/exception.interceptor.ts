import {
	BadRequestException,
	CallHandler,
	ExecutionContext,
	Logger,
	NestInterceptor,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { ApiErrorResponse } from "@witsoft/libs/api";
import { ExceptionBase } from "@witsoft/libs/exceptions";

import { RequestContextService } from "../context/AppRequestContext";

export class ExceptionInterceptor implements NestInterceptor {
	private readonly logger: Logger = new Logger(ExceptionInterceptor.name);

	intercept(
		_context: ExecutionContext,
		next: CallHandler,
	): Observable<ExceptionBase> {
		return next.handle().pipe(
			catchError((err) => {
				// Registro con fines de depuración
				if (err.status >= 400 && err.status < 500) {
					this.logger.debug(
						`[${RequestContextService.getRequestId()}] ${err.message}`,
					);

					const isClassValidatorError =
						Array.isArray(err?.response?.message) &&
						typeof err?.response?.error === "string" ;

					// Transformación de errores
					if (isClassValidatorError) {
						err = new BadRequestException(
							new ApiErrorResponse({
								statusCode: err.status,
								message: err.message,
								error: err?.response?.error,
								subErrors: err?.response?.message,
								correlationId: RequestContextService.getRequestId(),
							}),
						);
					}
				}

				// Agregar ID de solicitud al mensaje de error
				if (!err.correlationId) {
					err.correlationId = RequestContextService.getRequestId();
				}

				if (err.response) {
					err.response.correlationId = err.correlationId;
				}

				return throwError(() => err);
			}),
		);
	}
}
