import { Transaction } from 'sequelize';

export interface TransactionHost {
  transaction: Transaction;
}

export enum ROLE {
  'ADMIN' = 'ADMIN',
  'USER' = 'USER',
}
