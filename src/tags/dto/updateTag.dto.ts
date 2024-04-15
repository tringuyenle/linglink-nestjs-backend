import { IsNotEmpty } from 'class-validator'
import { Question } from '../../../schemas/question.schema'

export class UpdateTagDTO {
  @IsNotEmpty()
  tagName: string

  questionsList: Question[]

  createdAt: Date

  updatedAt: Date
}
