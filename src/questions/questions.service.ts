import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { Question } from '../../schemas/question.schema'
import { TagsService } from '../tags/tags.service'
import { CreateQuestionDTO } from './dto/createQuestion.dto'
import { UpdateQuestionDTO } from './dto/updateQuestion.dto'

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel('Question') private readonly questionModel: Model<Question>,
    private readonly tagsService: TagsService
  ) {}

  async createQuestion(createQuestionDto: CreateQuestionDTO): Promise<Question> {
    // const tagsList = await this.tagsService.getTagByListId(createQuestionDto.tagsListId);

    const newQuestion = new this.questionModel({
      ...createQuestionDto
      // tagsList: tagsList
    })
    // if (tagsList) await this.tagsService.addNewQuestionIntoTagsByIds(createQuestionDto.tagsListId, newQuestion);
    return newQuestion.save()
  }

  async getAllQuestions(): Promise<Question[]> {
    return this.questionModel.find().exec()
  }

  async getQuestionById(id: string): Promise<Question> {
    return await this.questionModel.findById(id).populate({ path: 'tagsList' }).exec()
    // if (Question) {
    //     return Question;
    // }
    // throw new HttpException('Question with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async updateQuestionById(id: string, updateQuestionDto: UpdateQuestionDTO): Promise<Question> {
    return this.questionModel.findByIdAndUpdate(id, updateQuestionDto, { new: true }).exec()
  }

  async removeQuestionById(id: string): Promise<void> {
    const currentQuestion = await this.getQuestionById(id)
    await this.tagsService.deleteQuestionIntoTagsByIds(currentQuestion.tagsList, currentQuestion)
    await this.questionModel.deleteOne({ _id: id } as FilterQuery<Question>)
  }
}
