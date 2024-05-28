import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Friend, FriendDocument } from '../../schemas/friend.schema';
import { User } from '../../schemas/user.schema';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(Friend.name) private friendModel: Model<FriendDocument>,
  ) {}

  async addFriend(user: any, friend: any): Promise<Friend> {
    try {
      let friends = await this.friendModel.findOne({ user: user._id }).exec();
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

  async deleteFriend(user: any, friend_id: any): Promise<Friend> {
    try {
      const { ObjectId } = require('mongodb');
      const user_friends = await this.friendModel
        .findOne({ user: user._id })
        .exec();
      if (!user_friends) {
        throw new Error('User has no friends');
      }
      const friendIndex = user_friends.friends.indexOf(new ObjectId(friend_id));
      if (friendIndex === -1) {
        throw new Error("Friend not found in user's friend list");
      }
      user_friends.friends.splice(friendIndex, 1);
      await user_friends.save();

      const friend_friends = await this.friendModel
        .findOne({ user: new ObjectId(friend_id) })
        .exec();
      if (!friend_friends) {
        throw new Error('Friend has no friends');
      }
      const userIndex = friend_friends.friends.indexOf(user._id);
      if (userIndex === -1) {
        throw new Error("User not found in friend's friend list");
      }
      friend_friends.friends.splice(userIndex, 1);
      await friend_friends.save();

      return user_friends.populate('friends');
    } catch (error) {
      throw new Error('Failed to delete friend');
    }
  }
}
