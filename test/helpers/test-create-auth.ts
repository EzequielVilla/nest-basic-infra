import { Sequelize } from 'sequelize-typescript';

import { INestApplication } from '@nestjs/common';

import { AuthService } from '../../src/resources/auth/auth.service';

/**
 * @description Creates email with the role that come in the params.
 * For example, it will be admin@gmail.com or employee@gmail.com with the same password 123123123
 */
export async function createAuthAndGetToken(
  sequelize: Sequelize,
  app: INestApplication,
  role: string,
): Promise<string> {
  const authService = app.get(AuthService);
  const transaction: any = await sequelize.transaction();
  const email = `${role}@gmail.com`;
  const password = '123123123';
  await authService.create(
    {
      email,
      password,
      name: 'test',
    },
    transaction,
  );
  await transaction.commit();

  const user = await authService.validateUser(email, password);

  const loginResponse = await authService.login(user);
  return loginResponse.token;
}
