import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '../../schemas/user.schema';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { GetUser } from './decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(MyJwtGuard)
  @Get('me')
  me(@GetUser() user: User): User {
    return user;
  }

  @Post()
  @UseGuards(MyJwtGuard)
  getUserByEmail(@Body() emailUser: { email: string }) {
    return this.userService.getByUserEmail(emailUser.email);
  }

  @Get('search')
  @UseGuards(MyJwtGuard)
  async searchUsersByName(
    @Req() req,
    @Query('name') name: string,
  ): Promise<User[]> {
    return this.userService.searchByName(req.user, name);
  }
}
