import { Post } from '../../../schemas/post.schema'
import { Comment } from '../../../schemas/comment.schema'
import { ReactionType } from '../../common/enums/reaction.enum'

export class ReactionPostDTO {
  postId: string
}

export class ReactionCommentDTO {
  commentId: string
}
