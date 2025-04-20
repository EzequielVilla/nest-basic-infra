import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { envs } from './../config/envs';

const isTestEnv = process.env.NODE_ENV === 'test';
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: envs.dbHost,
      port: Number(envs.dbPort),
      username: envs.dbUsername,
      password: envs.dbPassword,
      database: envs.dbDatabase,
      logging: !isTestEnv,
      autoLoadModels: true,
      // models: [Auth, User], // maybe we need this instead of autoLoadModels, i has some errors with the auto: true
    }),
  ],
})
export class DbModule {}
