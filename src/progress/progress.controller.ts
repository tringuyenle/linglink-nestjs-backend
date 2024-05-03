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
import { ProgressService } from './progress.service';
import { MyJwtGuard } from 'src/auth/guard/myjwt.guard';
import { UserService } from 'src/user/user.service';

@Controller('friends')
export class ProgressController {
  constructor(
    private readonly progressService: ProgressService,
    private readonly userService: UserService
  ) {}

  // @UseGuards(MyJwtGuard)
  // @Post('')
  // async addProgress(
  //   @Req() req: any,
  //   @Body() friend: { friendId: string },
  // ) {
  //   let newProgress = await this.userService.getByUserId(friend.friendId);
  //   return this.friendService.addProgress(req.user, newProgress);
  // }

  // @UseGuards(MyJwtGuard)
  // @Get('/:userId')
  // async getEvents(@Param('userId') userId: string) {
  //   return this.friendService.getListProgresss(userId);
  // }
}
