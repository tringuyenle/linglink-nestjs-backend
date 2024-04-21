import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'schemas/message.schema';
import { User } from 'schemas/user.schema';
import { ChatsService } from 'src/chat/chats.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    private readonly chatsService: ChatsService,
  ) {}

  async getMessage(user: User, chatRoomId: string) {
    try {
      const chatRoom = await this.chatsService.checkChatRoom(user, chatRoomId);
      if (!chatRoom)
        throw new HttpException('Chat room not found', HttpStatus.NOT_FOUND);

      const messages = await this.messageModel
        .find(
          { chatRoomId: chatRoom.chatRoomId },
          { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 },
        )
        .populate('from', '-hashedPassword -role -createdAt -updatedAt -__v')
        .exec();
      return messages;
    } catch (err) {
      throw new HttpException(
        'Failed to get message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  sendMessage(message: any) {
    try {
      const newMessage = new this.messageModel({
        ...message,
        from: message.from._id,
      });
      newMessage.save();
    } catch (err) {
      throw new HttpException(
        'Failed to create message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
