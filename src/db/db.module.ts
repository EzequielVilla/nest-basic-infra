import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './../config/envs';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${envs.dbUsername}:${envs.dbPassword}@${envs.dbHost}/?appName=${envs.dbDatabase}?retryWrites=true&w=majority`,
    ),
  ],
})
export class DbModule {}
