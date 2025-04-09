import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ClientSession, Types } from 'mongoose';
import { User } from './../user/entities/user.entity';
import { UserService } from './../user/user.service';
import { AuthRepository } from './auth.repository';
import { CreateAuthDto } from './dto/create-auth.dto';
import { FindAuthDto } from './dto/find-auth.dto';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createAuthDto: CreateAuthDto, session: ClientSession) {
    const password = await this.hashPassword(createAuthDto.password);
    const auth = await this.repository.create(
      createAuthDto.email,
      password,
      session,
    );
    await this.userService.create(createAuthDto.name, auth._id, session);
    return auth;
  }

  // async findAll() {
  //   return await this.repository.findAll();
  // }

  async findOne(findAuthDto: FindAuthDto): Promise<Auth> {
    const auth = await this.repository.findOneByEmail(findAuthDto.email);
    await this.comparePassword(findAuthDto.password, auth.password);
    return auth;
  }

  async validateUser(email: string, pass: string): Promise<Partial<User>> {
    const auth = await this.findOne({ email, password: pass });
    const user = await this.userService.findByAuthId(auth._id);
    return user;
  }
  async login(user: Partial<User>) {
    const payload = {
      authId: user.authId,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async findById(id: Types.ObjectId) {
    return await this.repository.findById(id);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private async comparePassword(password: string, passwordFromDb: string) {
    try {
      const isMatch = await bcrypt.compare(password, passwordFromDb);
      if (!isMatch) {
        throw new Error();
      }
    } catch (error) {
      throw new HttpException('WRONG_PASSWORD', 400);
    }
  }
}
