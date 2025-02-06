import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Auth } from './../auth/entities/auth.entity';
import { envs } from './../config/envs';
import { User } from './../user/entities/user.entity';

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
      models: [Auth, User],
    }),
  ],
})
export class DbModule {}
