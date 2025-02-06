import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionHost } from './../common/types';
import { User } from './../user/entities/user.entity';
import { IAuthRepository } from './auth.interface';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@InjectModel(Auth) private authRepository: typeof Auth) {}
  async findOneByEmail(email: string): Promise<Auth> {
    try {
      const auth = await this.authRepository.findOne({
        where: { email },
        include: { model: User },
      });
      if (!auth) {
        throw new Error('USER_NOT_FOUND');
      }
      return auth;
    } catch (error) {
      if (error.message === 'USER_NOT_FOUND') {
        throw new HttpException('USER_NOT_FOUND', 404);
      }
      throw new HttpException('ERROR_RETRIEVING_USER', 400);
    }
  }

  async create(
    email: string,
    password: string,
    transactionHost: TransactionHost,
  ) {
    try {
      return await this.authRepository.create(
        { email, password },
        transactionHost,
      );
    } catch (error) {
      if (error.message === 'Validation error') {
        throw new HttpException('EMAIL_MUST_BE_UNIQUE', 400);
      }
      throw new HttpException(error.message, 400);
    }
  }
  async findAll() {
    try {
      return await this.authRepository.findAll();
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
  async findById(id: string) {
    try {
      const auth = await this.authRepository.findByPk(id, {
        include: { model: User },

        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt', 'id'],
        },
      });

      if (!auth) {
        throw new Error('AUTH_NOT_FOUND');
      }

      return auth;
    } catch (error) {
      if (error.message === 'AUTH_NOT_FOUND') {
        throw new HttpException(error.message, 404);
      }
      throw new HttpException('ERROR_RETRIEVING_AUTH_ID', 400);
    }
  }
}
