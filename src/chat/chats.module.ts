import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MessageSchema } from '../../schemas/message.schema';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ReserPasswordTokenSchema } from 'schemas/reset-password-token.schema';
import { UserSchema } from '../../schemas/user.schema';
import { ChatsGateway } from './chats.gateway';
import { ChatRoomSchema } from '../../schemas/chatroom.schema';
import { MessageService } from '../message/message.service';
import { RequestAddFriendService } from '../request-add-friend/request-add-friend.service';
import { RequestAddFriendSchema } from '../../schemas/request-add-friend.schema';
import { FriendService } from '../friend/friend.service';
import { Friend, FriendSchema } from '../../schemas/friend.schema';
import { Progress, ProgressSchema } from '../../schemas/progress.schema';
import { NotificationService } from '../notification/notification.service';
import { Notification, NotificationSchema } from '../../schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Message', schema: MessageSchema },
      { name: 'ChatRoom', schema: ChatRoomSchema },
      { name: 'ReserPasswordToken', schema: ReserPasswordTokenSchema },
      { name: 'RequestAddFriend', schema: RequestAddFriendSchema },
      { name: Friend.name, schema: FriendSchema },
      { name: Progress.name, schema: ProgressSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [
    ChatsService,
    AuthService,
    UserService,
    JwtService,
    ConfigService,
    ChatsGateway,
    MessageService,
    RequestAddFriendService,
    FriendService,
    NotificationService
  ],
  controllers: [ChatsController],
})
export class ChatsModule {}
