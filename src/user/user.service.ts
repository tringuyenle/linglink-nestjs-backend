import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { CreateUserDTO } from './dto/createUser.dto';
import { CreateUserByOauthDTO } from './dto/createUserByOauth.dto';
import * as argon from 'argon2';
import { UserDTO } from './dto/userDto.dto';
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

  async searchByName(user: User, name: string): Promise<User[]> {
    const users = await this.userModel
      .find({
        name: { $regex: name, $options: 'i' },
        _id: { $ne: user._id },
      })
      .limit(50)
      .exec();

    return users;
  }

  async getByUserId(_id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: _id }).exec();
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getByUserIdV2(_id: string): Promise<UserDTO> {
    const user = await this.userModel.findOne({ _id: _id }).exec();
    if (user) {
      const sanitizedUser: UserDTO = {
        avatar: user.avatar,
        name: user.name,
        target: user.target,
      };
      return sanitizedUser;
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

  async changerUserPassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    const isPasswordMatching = await argon.verify(
      user.hashedPassword,
      oldPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }
    const newHashedPassword = await argon.hash(newPassword);
    const updatedUser = await this.userModel.updateOne(
      { _id: userId },
      { $set: { hashedPassword: newHashedPassword } },
      { new: true },
    );
    return updatedUser;
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

  async setTarget(
    userId: string,
    target: { description: string; startDate: Date; targetDate: Date },
  ) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.target = target;
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
