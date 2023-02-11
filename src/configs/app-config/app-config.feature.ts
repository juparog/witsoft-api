import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
	nodeEnv: process.env.NODE_ENV,
	host: process.env.HOST || "localhost",
	port: parseInt(process.env.PORT),
	apiName: process.env.API_NAME,
	apiDescription: process.env.API_DESCRIPTION || "ApiName",
	apiVersion: process.env.API_VERSION || "Api description",
	apiPrefix: process.env.API_PREFIX || "api",
}));
