import { TransactionHost } from 'src/common/types';
import { Auth } from './entities/auth.entity';

export interface IAuthService {}

export interface IAuthRepository {
  create(
    email: string,
    password: string,
    transactionHost: TransactionHost,
  ): Promise<Auth>;
  findAll(): Promise<Auth[]>;
  findOneByEmail(email: string): Promise<Auth>;
  // update(id: number, updateAuthDto: UpdateAuthDto): Promise<Auth>;
  // remove(id: number): Promise<Auth>;
}
