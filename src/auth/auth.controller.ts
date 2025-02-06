import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from './security/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectConnection() private sequelize: Sequelize,
  ) {}

  @Post('/signup')
  async create(@Body() createAuthDto: CreateAuthDto) {
    try {
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        return await this.authService.create(createAuthDto, transactionHost);
      });
    } catch (error) {
      throw error;
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
