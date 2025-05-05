import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/resources/auth/security/roles.guard';
import { JwtAuthGuard } from './../auth/security/jwt-auth.guard';
import { Roles } from './../auth/security/roles.decorator';
import { ROLE } from './../common/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([ROLE.ADMIN])
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Patch('')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user.id;
    return this.userService.update(id, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
