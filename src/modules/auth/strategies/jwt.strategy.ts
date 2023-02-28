import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

import { AppConfigService } from "@witsoft/config/app-config/app-config.service";

import { PayloadTokenProps } from "../domain/auth.types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly appConfig: AppConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: appConfig.jwtSecretKey,
		});
	}

	async validate(payload: PayloadTokenProps) {
		// TODO: Aqui se puede hacer mas validaciones sobre el token, por ejemplo buscar el id en la base de datos.
		return payload;
	}
}
