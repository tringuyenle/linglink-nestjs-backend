import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationController } from './notification.controller';
import { UserService } from '../user/user.service';
import { UserSchema } from '../../schemas/user.schema';
import { Notification, NotificationSchema } from '../../schemas/notification.schema';
import { NotificationService } from './notification.service';
import { Progress, ProgressSchema } from '../../schemas/progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Progress.name, schema: ProgressSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, UserService],
})
export class NotificationModule {}
