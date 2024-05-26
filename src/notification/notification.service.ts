import { Model, Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'schemas/user.schema';
import {
  Notification,
  NotificationDocument,
} from '../../schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async create(sender: User, data: CreateNotificationDto) {
    // const receiver = await this.userModel.findOne({ _id: data.receiver }).exec();

    const newNoti = new this.notificationModel({
      sender: sender._id,
      receiver: new Types.ObjectId(data.receiver),
      title: data.title,
      content: data.content,
    });

    await newNoti.save();
    return HttpStatus.CREATED;
  }

  async getNotificationByUserId(
    user: User,
    lastNoti?: string,
  ): Promise<NotificationDocument[]> {
    const query: any = {};
    query.receiver = user._id;

    if (lastNoti !== undefined) {
      query._id = { $lt: lastNoti };
    }

    const result = await this.notificationModel
      .find(query)
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();
    return result;
  }

  async viewNotifications(ids: string[]): Promise<void> {
    try {
      await this.notificationModel.updateMany(
        { _id: { $in: ids } },
        { $set: { isViewed: true } },
      );
    } catch (err) {
      throw new HttpException(
        'Failed to update notification status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
