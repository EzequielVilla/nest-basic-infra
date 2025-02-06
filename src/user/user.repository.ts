import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionHost } from './../common/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async create(
    name: string,
    authId: string,
    transactionHost: TransactionHost,
    role?: string,
  ) {
    try {
      await this.userRepository.create({ name, role, authId }, transactionHost);
    } catch (error) {
      throw new HttpException('ERROR_CREATING_USER', 400);
    }
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.update(updateUserDto, { where: { id } });
    } catch (error) {
      throw new HttpException('ERROR_UPDATING_USER', 400);
    }
  }
  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.findAll({
        include: {
          all: true,
          nested: true,
          attributes: { exclude: ['password'] },
        },
      });
    } catch (error) {
      throw new HttpException('ERROR_RETRIEVING_USERS', 400);
    }
  }
}
