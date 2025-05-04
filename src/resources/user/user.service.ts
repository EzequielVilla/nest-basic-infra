import { Injectable } from '@nestjs/common';
import { TransactionHost } from './../common/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}
  async create(
    name: string,
    authId: string,
    transactionHost: TransactionHost,
    role?: string,
  ) {
    await this.repository.create(name, authId, transactionHost, role);
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.repository.update(id, updateUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.findAll();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
