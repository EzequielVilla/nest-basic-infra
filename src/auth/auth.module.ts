import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './../user/user.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { Auth } from './entities/auth.entity';
import { JwtStrategy } from './security/jwt.strategy';
import { LocalStrategy } from './security/local.strategy';

@Module({
  imports: [
    SequelizeModule.forFeature([Auth]),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    // UserService, // Test if it is necessary, because the import should handle the providers that user module exports
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [SequelizeModule],
})
export class AuthModule {}
