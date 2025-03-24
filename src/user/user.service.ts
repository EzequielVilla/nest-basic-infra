import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}
  async create(
    name: string,
    authId: Types.ObjectId,
    role?: string,
  ): Promise<User> {
    return await this.repository.create({ name, authId, role });
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.repository.update(id, updateUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.findAll();
  }
  async findByAuthId(authId: Types.ObjectId): Promise<User> {
    return await this.repository.findByAuthId(authId);
  }
}
