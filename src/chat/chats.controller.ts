import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MyJwtGuard } from 'src/auth/guard/myjwt.guard';
import { ChatsService } from './chats.service';
import { CreateChatRoomDTO } from './dto/createChatRoom.dto';

//@UseGuards(MyJwtGuard)
@Controller('chats')
export class ChatsController {
    constructor(
        private readonly chatsService: ChatsService,
    ) { }

    @Get('create-socket-token')
    @UseGuards(MyJwtGuard)
    async createSocketToken(@Req() req) {
        return await this.chatsService.createSocketToken(req.user)
    }

    @Get()
    @UseGuards(MyJwtGuard)
    async getChatRoom(@Req() req) {
        return await this.chatsService.getChatRoom(req.user)
    }
}
