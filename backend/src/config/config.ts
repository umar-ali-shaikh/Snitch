import dotenv from "dotenv";

dotenv.config();

type Config = {
  readonly MONGO_URI: string;
  readonly PORT: number;
  readonly JWT_SECRET: string;
  readonly CLIENT_URL: string;
};

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is required. Add it to backend/.env.");
}

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is required. Add it to backend/.env.");
}

const port = Number(process.env.PORT ?? 5000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

export const config: Config = {
  MONGO_URI: mongoUri,
  PORT: port,
  JWT_SECRET: jwtSecret,
  // Frontend origin allowed by CORS (Vite dev server by default)
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:5173",
};
