import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TransactionHost } from './../common/types';
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
  async create(createAuthDto: CreateAuthDto, transactionHost: TransactionHost) {
    const password = await this.hashPassword(createAuthDto.password);
    const auth = await this.repository.create(
      createAuthDto.email,
      password,
      transactionHost,
    );
    await this.userService.create(createAuthDto.name, auth.id, transactionHost);
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
    const { ...result } = auth.user;
    return result;
  }
  async login(user: Partial<User>) {
    const payload = {
      authId: user.authId,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async findById(id: string) {
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
        throw new Error('WRONG_PASSWORD');
      }
    } catch (error) {
      throw new HttpException('WRONG_PASSWORD', 400, { cause: error.message });
    }
  }
}
