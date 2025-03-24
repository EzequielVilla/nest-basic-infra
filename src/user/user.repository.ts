import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<User> {
    const user = new this.userModel({ ...data, _id: new Types.ObjectId() });
    try {
      return await user.save();
    } catch (error) {
      throw new HttpException('ERROR_CREATING_USER', 400, {
        cause: error,
        description: 'Failed to create user',
      });
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new HttpException('ERROR_FINDING_USERS', 400, {
        cause: error,
        description: 'Failed to find users',
      });
    }
  }

  async findByAuthId(authId: Types.ObjectId): Promise<User> {
    try {
      const user = await this.userModel.findOne({ authId }).exec();
      if (!user) {
        throw new HttpException('USER_NOT_FOUND', 404);
      }
      return user;
    } catch (error) {
      throw new HttpException('ERROR_FINDING_USER', 400, {
        cause: error,
        description: 'Failed to find user',
      });
    }
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      return await this.userModel
        .findByIdAndUpdate(id, data, { new: true })
        .exec();
    } catch (error) {
      throw new HttpException('ERROR_UPDATING_USER', 400, {
        cause: error,
        description: 'Failed to update user',
      });
    }
  }
}
