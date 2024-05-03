import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { 
  Progress, 
  ProgressDocument 
} from 'schemas/progress.schema';
import { User } from 'schemas/user.schema';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
    @InjectModel('User') private userModel: Model<User>
  ) {}

  @Cron('0 0 0 * * *')
  async createDailyProgressForAllUsers() {
    const users = await this.userModel.find().exec();
    for (const user of users) {
      const newProgress = new this.progressModel({
        user: user._id,
        date: new Date(),
        wrongAnswerQuestions: [],
        totalQuestions: [],
      });
      await newProgress.save();
    }
  }
}