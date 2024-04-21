import { IsNotEmpty } from 'class-validator'

export class UpdateCommentDTO {
  @IsNotEmpty()
  content: string

  createdAt: Date

  updatedAt: Date
}
