import { IsNotEmpty } from 'class-validator'
import { Post } from '../../../schemas/post.schema'
import { User } from '../../../schemas/user.schema'

export class CreateCommentDTO {
  @IsNotEmpty()
  content: string

  author: User

  post: Post

  comment: Comment

  createdAt: Date

  updatedAt: Date
}
