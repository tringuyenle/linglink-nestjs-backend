import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { MyJwtGuard } from 'src/auth/guard/myjwt.guard';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('')
  @UseGuards(MyJwtGuard)
  getMessage(@Req() req, @Query('chatRoomId') chatRoomId: string) {
    return this.messageService.getMessage(req.user, chatRoomId);
  }
}
