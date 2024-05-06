import { Model, Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { 
  Progress, 
  ProgressDocument 
} from '../../schemas/progress.schema';
import { User } from 'schemas/user.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async createDailyProgressForAllUsers() {
    const users = await this.userModel.find().exec();
    const date = new Date();
    for (const user of users) {
      const newProgress = new this.progressModel({
        user: user._id,
        date: date,
        wrongAnswerQuestions: [],
        totalQuestions: [],
      });
      await newProgress.save();
    }
  }

  async getProgressByUserId(
    userId: string,
    date?: Date,
  ): Promise<ProgressDocument[]> {
    let query = this.progressModel.find({ user: new Types.ObjectId(userId) });

    if (date !== undefined) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .where('date')
        .gte(startOfDay.getTime())
        .lt(endOfDay.getTime());
    }
    const result: any = await query
      .populate('wrongAnswerQuestions')
      .populate('flashcards')
      .populate('totalQuestions')
      .exec();
    return result;
  }

  async updateQuestionInProgress(
    user: any,
    questionId: string,
    isCorrect: boolean,
  ): Promise<HttpStatus> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const progress = await this.progressModel
        .findOne({
          user: user._id,
          date: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        })
        .exec();
      if (!progress) {
        throw new Error('Progress not found');
      }
      const question = new Types.ObjectId(questionId);
      if (progress.totalQuestions.includes(question)) {
        return null;
      }
      if (!isCorrect) {
        progress.wrongAnswerQuestions.push(question);
      }
      progress.totalQuestions.push(question);
      await progress.save();
      return HttpStatus.OK;
    } catch (error) {
      throw new HttpException(
        'Failed to update progress',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateFlashcard(
    user: any,
    flashcardId: string,
    isRemember: boolean,
  ): Promise<HttpStatus> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const progress = await this.progressModel
        .findOne({
          user: user._id,
          date: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        })
        .exec();
      if (!progress) {
        throw new Error('Progress not found');
      }
      const flashcard = new Types.ObjectId(flashcardId);
      if (isRemember) {
        progress.flashcards.push(flashcard);
      } else {
        const index = progress.flashcards.indexOf(flashcard);
        if (index !== -1) {
          progress.flashcards.splice(index, 1);
        }
      }
      await progress.save();
      return HttpStatus.OK;
    } catch (error) {
      throw new HttpException(
        'Failed to update progress',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
