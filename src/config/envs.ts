import 'dotenv/config.js';
import * as joi from 'joi';

interface EnvVars {
  DB_HOST: string;
  DB_PORT: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  JWT_SECRET: string;
  PORT: number;
}

const envsSchema = joi
  .object({
    DB_HOST: joi.string().required(),
    DB_PORT: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_DATABASE: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    PORT: joi.number().required(),
  })
  .unknown(true);

let { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
if (process.env.NODE_ENV === 'test') {
  DB_HOST = process.env.DB_TEST_HOST;
  DB_PORT = process.env.DB_TEST_PORT;
  DB_DATABASE = process.env.DB_TEST_DATABASE;
} else if (
  process.env.SYNC_TYPE === 'alter' ||
  (process.env.SYNC_TYPE === 'force' && process.env.NODE_ENV === 'development')
) {
  DB_HOST = process.env.DB_HOST_SYNC;
  DB_PORT = process.env.DB_PORT_SYNC;
}
const { error, value } = envsSchema.validate({
  ...process.env,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
const envVars: EnvVars = value;

export const envs = {
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUsername: envVars.DB_USERNAME,
  dbPassword: envVars.DB_PASSWORD,
  dbDatabase: envVars.DB_DATABASE,
  jwtSecret: envVars.JWT_SECRET,
  port: envVars.PORT,
};
