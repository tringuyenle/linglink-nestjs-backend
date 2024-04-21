import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'schemas/message.schema';
import { ChatsService } from 'src/chat/chats.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatRoomSchema } from 'schemas/chatroom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        {name: 'Message', schema: MessageSchema},
        {name: 'ChatRoom', schema: ChatRoomSchema},
    ]),
],
  controllers: [MessageController],
  providers: [MessageService, ChatsService, JwtService, ConfigService]
})
export class MessageModule {}
