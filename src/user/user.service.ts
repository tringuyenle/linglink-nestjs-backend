import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { CreateUserDTO } from './dto/createUser.dto';
import { CreateUserByOauthDTO } from './dto/createUserByOauth.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getByUserEmail(email: string) {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async searchByName(user: User, name: string) {
    const users = await this.userModel
      .find({
        name: { $regex: name, $options: 'i' },
        _id: { $ne: user._id },
      })
      .exec();
    return users;
  }

  async getByUserId(_id: string) {
    const user = await this.userModel.findOne({ _id: _id }).exec();
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDTO) {
    const newUser = await this.userModel.create(userData);
    await newUser.save();
    return newUser;
  }

  async updatePasswordForUser(userId: string, hashPassword: string) {
    const updatedUser = await this.userModel.updateOne(
      { _id: userId },
      { $set: { hashedPassword: hashPassword } },
      { new: true },
    );
    return updatedUser;
  }

  async findOrCreateByOauth(userData: CreateUserByOauthDTO) {
    const user = await this.userModel.findOne({ email: userData.email }).exec();
    if (user) return user;
    else {
      const newUser = await this.userModel.create(userData);
      await newUser.save();
      return newUser;
    }
  }
}
