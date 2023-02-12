import { registerAs } from "@nestjs/config";

export default registerAs("db", () => ({
	name: process.env.DB_NAME,
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	formatUri: process.env.DB_FORMAT_URI || "mongodb",
	options: process.env.DB_OPTIONS,
	loggerLevel: process.env.DB_LOGGER_LEVEL || "info",
}));
