import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoom } from 'schemas/chatroom.schema';
import { User } from 'schemas/user.schema';
import { CreateChatRoomDTO } from './dto/createChatRoom.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel('ChatRoom') private readonly chatRoomModel: Model<ChatRoom>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createChatRoom(createChatRoomDTO: CreateChatRoomDTO) {
    try {
      const chatRoomId_sender =
        createChatRoomDTO.request.sender._id.toString() +
        '--' +
        createChatRoomDTO.request.receiver._id.toString();
      const chatRoomId_receiver =
        createChatRoomDTO.request.receiver._id.toString() +
        '--' +
        createChatRoomDTO.request.sender._id.toString();
      let chatRoom = await this.chatRoomModel.findOne({
        chatRoomId: { $in: [chatRoomId_sender, chatRoomId_receiver] },
      });

      if (!chatRoom) {
        chatRoom = await this.chatRoomModel.create({
          chatRoomId: chatRoomId_sender,
          participant: [
            createChatRoomDTO.request.sender._id,
            createChatRoomDTO.request.receiver._id,
          ],
          createAt: Date.now(),
        });
        await chatRoom.save();
      }

      return chatRoom;
    } catch (err) {
      throw new HttpException(
        'Failed to create chat room',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createSocketToken(user: User) {
    const token = await this.jwtService.signAsync(
      {
        user: user,
      },
      { secret: this.configService.get('JWT_SOCKET_SECRET') },
    );

    return token;
  }

  async getChatRoom(user: User) {
    const listChatRooms = await this.chatRoomModel
      .find({ participant: { $in: [user._id] } })
      .populate('participant')
      .exec();

    return listChatRooms.map((chatRoom) => {
      // Filter the participant array to remove the current user
      const friends =
        chatRoom.participant[0]._id.toString() !== user._id.toString()
          ? chatRoom.participant[0]
          : chatRoom.participant[1];

      // Return a new object with the transformed participant array
      return { ...chatRoom.toObject(), friends };
    });
  }

  async checkChatRoom(user: User, chatRoomId: string) {
    const chatRoom = await this.chatRoomModel
      .findOne({ chatRoomId: chatRoomId })
      .populate('participant')
      .exec();
    if (
      chatRoom.participant[0]._id.toString() === user._id.toString() ||
      chatRoom.participant[1]._id.toString() === user._id.toString()
    )
      return chatRoom;
    return null;
  }
}
