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
import { UserDTO } from './dto/userDto.dto';

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

  @Get(':id')
  @UseGuards(MyJwtGuard)
  async getById(@Param('id') id: string): Promise<UserDTO> {
    return this.userService.getByUserIdV2(id);
  }

  @Post('changepassword')
  @UseGuards(MyJwtGuard)
  async changeUserPassword(
    @Req() req,
    @Body() user: { userId: string; oldPassword: string; newPassword: string },
  ) {
    return this.userService.changerUserPassword(
      req.user._id,
      user.oldPassword,
      user.newPassword,
    );
  }
}
