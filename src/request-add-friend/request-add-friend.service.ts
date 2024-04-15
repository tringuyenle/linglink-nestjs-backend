import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { RequestAddFriend } from 'schemas/request-add-friend.schema';
import { ChatsService } from 'src/chat/chats.service';
import { User } from 'schemas/user.schema';
import { RequestDto } from './dto/request.dto';
import { NewRequestDto } from './dto/newRequest.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RequestAddFriendService {
    constructor(
        @InjectModel('RequestAddFriend') private readonly requestAddFriendModel: Model<RequestAddFriend>,
        private readonly chatsService: ChatsService,
        private readonly userService: UserService
    ) {}

    async createRequest(user: User, newRequestDto: NewRequestDto) {
        try {
            const receiver = await this.userService.getByUserId(newRequestDto.receiver)
            const sender = await this.userService.getByUserId(user._id.toString());
            if (!receiver) {
                throw new Error(`User with id ${newRequestDto.receiver} not found`);
            }

            // Check if a request with the same sender and receiver already exists
            const existingRequest = await this.requestAddFriendModel.findOne({
                sender: sender._id,
                receiver: receiver._id
            });

            const anotheEexistingRequest = await this.requestAddFriendModel.findOne({
                sender: receiver._id,
                receiver: sender._id
            });

            if (existingRequest) {
                return existingRequest.status;
            } else if (anotheEexistingRequest) return anotheEexistingRequest.status;

            const newRequest = await this.requestAddFriendModel.create({
                receiver: receiver,
                sender: sender,
                status: 'PENDING'
            });
    
            await newRequest.save();
    
            return newRequest;
        } catch(error) {
            throw new HttpException('Failed to create request', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async acceptRequest(user: User, requestDto: RequestDto) {
        try {
            const request = await this.requestAddFriendModel.findOne({ _id: requestDto.request });

            if (!request) {
                throw new Error(`Request with id ${requestDto} not found`);
            }

            if (user._id.toString() != request.receiver._id.toString()) 
                throw new Error(`User ${request.receiver} is not authorized to accept this request`);

            await this.requestAddFriendModel.findByIdAndUpdate(
                request._id,
                { status: 'DONE' },
            );

            const newChatRoom = await this.chatsService.createChatRoom({request: request});
            return newChatRoom;
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        
        }
    }

    async denyRequest(user: User, requestDto: RequestDto) {
        try {
            const request = await this.requestAddFriendModel.findOne({ _id: requestDto.request });

            if (!request) {
                throw new Error(`Request with id ${requestDto} not found`);
            }

            if (user._id.toString() != request.receiver._id.toString()) 
                throw new Error(`User ${request.receiver} is not authorized to deny this request`);

            await this.requestAddFriendModel.findByIdAndDelete(request._id);

            return { message: 'Request denied and deleted successfully' };
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        
        }
    }

    getRequestList(user: User) {
        return this.requestAddFriendModel.find({ receiver: user._id, status: 'PENDING' }, {createdAt: 0, updatedAt: 0, __v: 0}).populate('sender', '-role -createdAt -updatedAt -hashedPassword -__v');
    }
}
