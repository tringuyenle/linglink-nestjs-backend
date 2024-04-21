import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Post } from '../../schemas/post.schema'
import { Topic } from '../../schemas/topic.schema'
import { CreateTopicDTO } from './dto/createTopic.dto'
import { UpdateTopicDTO } from './dto/updateTopic.dto'

@Injectable()
export class TopicsService {
  constructor(@InjectModel('Topic') private readonly topicModel: Model<Topic>) {}

  async createTopic(createTopicDto: CreateTopicDTO): Promise<Topic> {
    const createdTopic = new this.topicModel(createTopicDto)
    return createdTopic.save()
  }

  async getAllTopics(): Promise<Topic[]> {
    return this.topicModel.find().exec()
  }

  async getTopicById(id: string): Promise<Topic> {
    return await this.topicModel.findById(id).populate({ path: 'postsList' }).exec()
    // if (topic) {
    //     return topic;
    // }
    // throw new HttpException('Topic with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async updateTopicById(id: string, updateTopicDto: UpdateTopicDTO): Promise<Topic> {
    return this.topicModel.findByIdAndUpdate(id, updateTopicDto, { new: true }).exec()
  }

  async addNewPostIntoTopicById(id: string, post: Post): Promise<Topic> {
    return this.topicModel.findByIdAndUpdate(id, { $push: { postsList: post } }, { new: true }).exec()
  }

  async deletePostInTopicById(id: string, post: Post): Promise<Topic> {
    return this.topicModel.findByIdAndUpdate(id, { $pull: { postsList: post._id } }, { new: true }).exec()
  }

  async removeTopicById(id: string): Promise<Topic> {
    return this.topicModel.findByIdAndRemove(id).exec()
  }
}
