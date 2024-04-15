import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { QuestionSchema } from '../../schemas/question.schema'
import { QuestionsService } from './questions.service'
import { QuestionsController } from './questions.controller'
import { TagsService } from '../tags/tags.service'
import { TagSchema } from '../../schemas/tag.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Question', schema: QuestionSchema },
      { name: 'Tag', schema: TagSchema }
    ])
  ],
  providers: [QuestionsService, TagsService],
  controllers: [QuestionsController]
})
export class QuestionsModule {}
