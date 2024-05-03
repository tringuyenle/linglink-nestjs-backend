import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { MyJwtGuard } from 'src/auth/guard/myjwt.guard';
import { UserService } from 'src/user/user.service';

@Controller('friends')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private readonly userService: UserService
  ) {}

  @UseGuards(MyJwtGuard)
  @Post('')
  async addFriend(
    @Req() req: any,
    @Body() friend: { friendId: string },
  ) {
    let newFriend = await this.userService.getByUserId(friend.friendId);
    return this.friendService.addFriend(req.user, newFriend);
  }

  @UseGuards(MyJwtGuard)
  @Get('/:userId')
  async getEvents(@Param('userId') userId: string) {
    return this.friendService.getListFriends(userId);
  }
}
