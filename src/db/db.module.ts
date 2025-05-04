import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Auth } from '../resources/auth/entities/auth.entity';
import { envs } from './../config/envs';
import { User } from './../user/entities/user.entity';

const isTestEnv = process.env.NODE_ENV === 'test';
const isProduction = process.env.NODE_ENV === 'production';
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: envs.dbHost,
      port: Number(envs.dbPort),
      username: envs.dbUsername,
      password: envs.dbPassword,
      database: envs.dbDatabase,
      logging: !isTestEnv || !isProduction,
      models: [Auth, User],
    }),
  ],
})
export class DbModule {}
