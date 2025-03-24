import { Types } from 'mongoose';
import { Auth } from './entities/auth.entity';

export interface IAuthService {}

export interface IAuthRepository {
  create(email: string, password: string): Promise<Auth>;
  findAll(): Promise<Auth[]>;
  findOneByEmail(email: string): Promise<Auth>;
  findById(id: Types.ObjectId): Promise<Auth>;
  findByIdAndUpdate(id: string, update: Partial<Auth>): Promise<Auth>;
  // update(id: number, updateAuthDto: UpdateAuthDto): Promise<Auth>;
  // remove(id: number): Promise<Auth>;
}
