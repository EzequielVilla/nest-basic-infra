import * as dotenv from 'dotenv';
import * as Joi from 'joi';

dotenv.config();

interface EnvVars {
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  JWT_SECRET: string;
  PORT: number;
}

const envSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  PORT: Joi.number().default(3000),
});

const { error, value: validatedEnv } = envSchema.validate(process.env, {
  allowUnknown: true,
  stripUnknown: true,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = validatedEnv;

export const envs = {
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUsername: envVars.DB_USERNAME,
  dbPassword: envVars.DB_PASSWORD,
  dbDatabase: envVars.DB_DATABASE,
  jwtSecret: envVars.JWT_SECRET,
  port: envVars.PORT,
};
