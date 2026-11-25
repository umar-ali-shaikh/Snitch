import dotenv from "dotenv";

dotenv.config();

type Config = {
  readonly MONGO_URI: string;
  readonly PORT: number;
  readonly JWT_SECRET: string;
};

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is required. Add it to backend/.env.");
}

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is required. Add it to backend/.env.");
}

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

export const config: Config = {
  MONGO_URI: mongoUri,
  PORT: port,
  JWT_SECRET: jwtSecret,
};
