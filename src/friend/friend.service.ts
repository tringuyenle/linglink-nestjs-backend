import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { 
  Friend, 
  FriendDocument 
} from 'schemas/friend.schema';
import { User } from 'schemas/user.schema';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(Friend.name) private friendModel: Model<FriendDocument>,
  ) {}

  async addFriend(
    user: any,
    friend: any,
  ): Promise<Friend> {
    try {
      let friends = await this.friendModel
        .findOne({ user: user._id })
        .exec();
      if (!friends) {
        friends = new this.friendModel({ user: user._id, friends: [] });
      }
      friends.friends.push(friend._id);
      await friends.save();
      return friends.populate('friends');
    } catch (error) {
      throw new Error('Failed to create event');
    }
  }

  async getListFriends(userId: string): Promise<User[]> {
    try {
      const friends = await this.friendModel
        .findOne({ user: new Types.ObjectId(userId) })
        .populate('friends')
        .exec();
      if (!friends) {
        return [];
      }
      return friends.friends;
    } catch (error) {
      return [];
    }
  }
}
