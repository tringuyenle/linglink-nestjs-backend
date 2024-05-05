import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { Friend, FriendSchema } from 'schemas/friend.schema';
import { UserService } from 'src/user/user.service';
import { UserSchema } from 'schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Friend.name, schema: FriendSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [FriendController],
  providers: [FriendService, UserService],
})
export class FriendModule {}
