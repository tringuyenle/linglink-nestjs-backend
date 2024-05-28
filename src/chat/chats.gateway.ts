import { Logger, UseFilters } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { WsCatchAllFilter } from '../exceptions/ws-catch-all-filter';
import { WsBadRequestException } from '../exceptions/ws-exceptions';
import { CreateMessageDTO } from './dto/createMessage.dto';
import { SocketWithAuth } from './types';
import { MessageService } from '../message/message.service';
import { RequestAddFriendService } from '../request-add-friend/request-add-friend.service';
import { NotificationService } from '../notification/notification.service';

@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({ namespace: 'chats' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatsGateway.name);
  constructor(
    private readonly messageService: MessageService,
    private readonly notificationService: NotificationService,
    private readonly requestAddFriendService: RequestAddFriendService,
  ) {}

  @WebSocketServer() io: Namespace;
  // Gateway initialized (provided in module and instantiated)
  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  async handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(
      `Socket connected with userID: ${client.user._id}, and name: "${client.user.name}"`,
    );

    // this.logger.log(`WS Client with id: ${client.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    client.join(client.user._id.toString());
    this.io.emit('enter-chat-room', `from ${client.user.name}`);
  }

  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    this.logger.debug(
      `Socket disconnected with userID: ${client.user._id}, and name: "${client.user.name}"`,
    );

    this.logger.log(`Disconnected socket id: ${client.id}`);
    this.logger.debug(
      `Number of connected sockets in system is: ${sockets.size}`,
    );

    // TODO - remove client from chat and send `participants_updated` event to remaining clients
  }

  @SubscribeMessage('test')
  async test() {
    throw new WsBadRequestException('error message');
  }

  @SubscribeMessage('join-room')
  async startchat(
    @MessageBody() room: { chatRoomID: string },
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    await client.join(room.chatRoomID);
    this.logger.debug(
      `user ${client.user._id} join to room ${room.chatRoomID}`,
    );
  }

  @SubscribeMessage('chat')
  async chat(
    @MessageBody() message: CreateMessageDTO,
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    // this.logger.debug(
    //   `Attempting to add chat from user ${client.user._id} to room ${message.chatRoomId}\n${message.content}`,
    // );

    const newMessage = {
      content: message.content,
      imgs_url: message.imgs_url,
      from: client.user,
      chatRoomId: message.chatRoomId,
    };

    this.messageService.sendMessage(newMessage);
    this.io.to(message.chatRoomId).emit('getmessage', newMessage);
  }

  @SubscribeMessage('send-notification')
  async sendNoti(
    @MessageBody() noti: { receiver: string; title: string; content: string },
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {

    const newNotification = {
      receiver: noti.receiver,
      title: noti.title,
      content: noti.content,
    };

    this.notificationService.create(client.user, newNotification);
    this.io.to(noti.receiver).emit('notification', {
      ...newNotification,
      sender: { name: client.user.name, avatar: client.user.avatar },
    });
  }

  @SubscribeMessage('request-add-friend')
  async request_friend(
    @MessageBody() request: { request: string; receiver: string; type: string },
    @ConnectedSocket() client: SocketWithAuth,
  ): Promise<void> {
    if (request.type === 'ADD') {
      const requestDto = { receiver: request.receiver };
      const newRequest = await this.requestAddFriendService.createRequest(
        client.user,
        requestDto,
      );
      if (newRequest === 'PENDING') {
        const receiver = client.user._id.toString();
        this.io.to(receiver).emit('request', {
          type: 'NOTI',
          content: 'Bạn đã gửi yêu cầu trước đó',
          receiver: receiver,
        });
      } else
        this.io.to(request.receiver).emit('request', {
          type: 'ADD',
          request: newRequest,
          receiver: request.receiver,
        });
      this.io.to(request.receiver).emit('notification', {
        content: ' đã gửi lời mời kết bạn đến bạn',
        sender: client.user.name,
      });
    } else if (request.type === 'ACCEPT') {
      const requestDto = { request: request.request };
      const newChatRoom = await this.requestAddFriendService.acceptRequest(
        client.user,
        requestDto,
      );
      this.io.to(request.receiver).emit('request', {
        type: 'ACCEPT',
        chatRoom: newChatRoom,
        receiver: request.receiver,
      });
      this.io.to(request.receiver).emit('notification', {
        title: ' đã chấp nhận lời mời kết bạn!',
        sender: { name: client.user.name, avatar: client.user.avatar },
        content: '',
      });
      this.io.to(client.user._id.toString()).emit('accept_status', {
        content: null,
        sender: null,
      });
    } else if (request.type === 'DENY') {
      const requestDto = { request: request.request };
      await this.requestAddFriendService.denyRequest(client.user, requestDto);
      this.io.to(request.receiver).emit('notification', {
        title: ' đã từ chối lời mời kết bạn',
        sender: { name: client.user.name, avatar: client.user.avatar },
        content: '',
      });
    }
    // this.logger.debug(
    //   ` user ${client.user.name} sent ${request} to ${request.receiver}`,
    // );
    // this.io.to(message.chatRoomId).emit('getmessage', newMessage);
  }
}
