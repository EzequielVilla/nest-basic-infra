import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { IAuthRepository } from './auth.interface';
import { Auth, AuthDocument } from './entities/auth.entity';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@InjectModel(Auth.name) private authModel: Model<AuthDocument>) {}

  async create(email: string, password: string): Promise<Auth> {
    try {
      const auth = await this.authModel.create({
        email,
        password,
        _id: new Types.ObjectId(),
      });
      return auth;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('AUTH_ALREADY_EXISTS', 409);
      }
      throw new HttpException('ERROR_CREATING_AUTH', 400, {
        cause: error,
        description: 'Failed to create auth',
      });
    }
  }

  async findAll(): Promise<Auth[]> {
    try {
      return this.authModel.find().exec();
    } catch (error) {
      throw new HttpException('ERROR_FINDING_AUTH', 400, {
        cause: error,
        description: 'Failed to find auth',
      });
    }
  }

  async findOneByEmail(email: string): Promise<Auth> {
    try {
      return await this.authModel.findOne({ email }).exec();
    } catch (error) {
      throw new HttpException('ERROR_FINDING_AUTH', 400, {
        cause: error,
        description: 'Failed to find auth',
      });
    }
  }

  async findById(id: Types.ObjectId): Promise<Auth> {
    try {
      const auth = await this.authModel.findById(id).exec();
      if (!auth) {
        throw new HttpException('AUTH_NOT_FOUND', 404);
      }
      return auth;
    } catch (error) {
      console.error('Error finding auth:', error);
      throw new HttpException('ERROR_FINDING_AUTH', 400, {
        cause: error,
        description: 'Failed to find auth',
      });
    }
  }

  async findByIdAndUpdate(id: string, update: Partial<Auth>): Promise<Auth> {
    try {
      return await this.authModel
        .findByIdAndUpdate(id, update, { new: true })
        .exec();
    } catch (error) {
      throw new HttpException('ERROR_UPDATING_AUTH', 400, {
        cause: error,
        description: 'Failed to update auth',
      });
    }
  }
}
