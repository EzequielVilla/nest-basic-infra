import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UserService } from './../../user/user.service';
import { jwtConstants } from './../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { authId: Types.ObjectId; iat: number }) {
    if (!payload.authId) {
      throw UnauthorizedException;
    }
    const authId =
      typeof payload.authId === 'string'
        ? new Types.ObjectId(payload.authId)
        : payload.authId;
    const auth = await this.authService.findById(authId);
    return await this.userService.findByAuthId(auth._id);
  }
}
