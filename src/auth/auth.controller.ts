import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from './security/local-auth.guard';
import { DbService } from '../db/db.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private dbService: DbService,
  ) {}

  @Post('/signup')
  async create(@Body() createAuthDto: CreateAuthDto) {
    const session = await this.dbService.getSessionWithTransaction();
    try {
      const response = await this.authService.create(createAuthDto, session);
      await session.commitTransaction();
      return response;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * @description First enter to local strategy, to the "validate" function. This returns an user. The user is injected into the request object.
   * Later took that req.user and send it to the "login" function, which generates the token with the JWT passport module. Which is configured in the auth.module.ts
   */
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  Login(@Request() req) {
    return this.authService.login(req.user);
  }
  // @Get()
  // async findAll() {
  //   return await this.authService.findAll();
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
