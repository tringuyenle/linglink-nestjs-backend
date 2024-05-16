import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { UserService } from '../user/user.service';

@Controller('friends')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(MyJwtGuard)
  @Post('')
  async addFriend(@Req() req: any, @Body() friend: { friendId: string }) {
    const newFriend = await this.userService.getByUserId(friend.friendId);
    return this.friendService.addFriend(req.user, newFriend);
  }

  @UseGuards(MyJwtGuard)
  @Get('/:userId')
  async getEvents(@Param('userId') userId: string) {
    return this.friendService.getListFriends(userId);
  }

  @UseGuards(MyJwtGuard)
  @Delete('/:userId')
  async deleteFriend(@Req() req: any, @Param('userId') userId: string) {
    return this.friendService.deleteFriend(req.user, userId);
  }
}
