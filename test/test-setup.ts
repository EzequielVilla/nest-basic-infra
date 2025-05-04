import { INestApplication } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { buildTestConfigApp } from './helpers/test-config-app';
import { createAuthAndGetToken } from './helpers/test-create-auth';

export let app: INestApplication;
export let sequelize: Sequelize;
export let adminToken: string;
export let employeeToken: string;

beforeAll(async () => {
  app = await buildTestConfigApp();
  sequelize = app.get<Sequelize>(Sequelize);
  adminToken = await createAuthAndGetToken(sequelize, app, 'ADMIN');
  employeeToken = await createAuthAndGetToken(sequelize, app, 'EMPLOYEE');
  // const data = await createFirstData(sequelize, app);

  await app.init();
});

/**
 * The DB will be cleaned when all tests are finished, so the products, the users, everything will remains in the db until the end.
 */
afterAll(async () => {
  await sequelize.sync({ force: true });
  if (app) await app.close();
  if (sequelize) await sequelize.close();
});
