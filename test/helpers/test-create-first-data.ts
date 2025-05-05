import { INestApplication } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

export async function createFirstData(
  sequelize: Sequelize,
  app: INestApplication,
) {}
