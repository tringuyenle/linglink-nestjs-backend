import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { Reaction } from '../../schemas/reaction.schema'
import { User } from '../../schemas/user.schema'
import { ReactionType } from '../common/enums/reaction.enum'

@Injectable()
export class ReactionsService {
  constructor(@InjectModel('Reaction') private readonly reactionModel: Model<Reaction>) {}

  async likePost(user: User, postId: string) {
    // Kiểm tra xem người dùng đã có reation nào trên post này chưa
    const existingReaction = await this.reactionModel.findOne({
      post: postId,
      user: user._id
    })

    if (!existingReaction) {
      // Nếu chưa có reaction nào của user cho post này, tạo mới
      await this.reactionModel.create({
        post: postId,
        user: user,
        reactionType: ReactionType.LIKE
      })
    } else if (existingReaction.reactionType === ReactionType.DISLIKE) {
      // Nếu đã dislike, cập nhật lại thành like
      await this.reactionModel.findOneAndUpdate(
        { _id: existingReaction._id } as FilterQuery<Reaction>,
        { $set: { reactionType: ReactionType.LIKE } },
        { new: true }
      )
    } else if (existingReaction.reactionType === ReactionType.LIKE) {
      // Ngược lại, nếu đã like rồi, xóa trạng thái like
      await this.reactionModel.findByIdAndRemove(existingReaction._id)
    }
    return HttpStatus.OK
  }

  async dislikePost(user: User, postId: string) {
    // Kiểm tra xem người dùng đã có reation nào trên post này chưa
    const existingReaction = await this.reactionModel.findOne({
      post: postId,
      user: user._id
    })

    if (!existingReaction) {
      // Nếu chưa có reaction nào của user cho post này, tạo mới
      await this.reactionModel.create({
        post: postId,
        user: user,
        reactionType: ReactionType.DISLIKE
      })
    } else if (existingReaction.reactionType === ReactionType.LIKE) {
      // Nếu đã dislike, cập nhật lại thành like
      await this.reactionModel.findOneAndUpdate(
        { _id: existingReaction._id } as FilterQuery<Reaction>,
        { $set: { reactionType: ReactionType.DISLIKE } },
        { new: true }
      )
    } else if (existingReaction.reactionType === ReactionType.DISLIKE) {
      // Ngược lại, nếu đã like rồi, xóa trạng thái like
      await this.reactionModel.findByIdAndRemove(existingReaction._id)
    }
    // Ngược lại, nếu đã like rồi, không làm gì cả
    return HttpStatus.OK
  }

  async likeComment(user: User, commentId: string) {
    // Kiểm tra xem người dùng đã có reation nào trên post này chưa
    const existingReaction = await this.reactionModel.findOne({
      comment: commentId,
      user: user._id
    })

    if (!existingReaction) {
      // Nếu chưa có reaction nào của user cho post này, tạo mới
      await this.reactionModel.create({
        comment: commentId,
        user: user,
        reactionType: ReactionType.LIKE
      })
    } else if (existingReaction.reactionType === ReactionType.DISLIKE) {
      // Nếu đã dislike, cập nhật lại thành like
      await this.reactionModel.findOneAndUpdate(
        { _id: existingReaction._id } as FilterQuery<Reaction>,
        { $set: { reactionType: ReactionType.LIKE } },
        { new: true }
      )
    } else if (existingReaction.reactionType === ReactionType.LIKE) {
      // Ngược lại, nếu đã like rồi, xóa trạng thái like
      await this.reactionModel.findByIdAndRemove(existingReaction._id)
    }
    return HttpStatus.OK
  }

  async dislikeComment(user: User, commentId: string) {
    // Kiểm tra xem người dùng đã có reation nào trên post này chưa
    const existingReaction = await this.reactionModel.findOne({
      comment: commentId,
      user: user._id
    })

    if (!existingReaction) {
      // Nếu chưa có reaction nào của user cho post này, tạo mới
      await this.reactionModel.create({
        comment: commentId,
        user: user,
        reactionType: ReactionType.DISLIKE
      })
    } else if (existingReaction.reactionType === ReactionType.LIKE) {
      // Nếu đã dislike, cập nhật lại thành like
      await this.reactionModel.findOneAndUpdate(
        { _id: existingReaction._id } as FilterQuery<Reaction>,
        { $set: { reactionType: ReactionType.DISLIKE } },
        { new: true }
      )
    } else if (existingReaction.reactionType === ReactionType.DISLIKE) {
      // Ngược lại, nếu đã like rồi, xóa trạng thái like
      await this.reactionModel.findByIdAndRemove(existingReaction._id)
    }

    return HttpStatus.OK
  }

  async checkPostReactionStatus(userId: string, postId: string) {
    const { ObjectId } = require('mongodb')
    userId = new ObjectId(userId)
    const existingReaction = await this.reactionModel.findOne({
      post: postId,
      user: userId
    })
    if (existingReaction) return existingReaction.reactionType
    return null
  }

  async checkCommentReactionStatus(userId: string, commentId: string) {
    const { ObjectId } = require('mongodb')
    userId = new ObjectId(userId)
    const existingReaction = await this.reactionModel.findOne({
      comment: commentId,
      user: userId
    })
    if (existingReaction) return existingReaction.reactionType
    return null
  }

  async getReactionByPostId(postId: string): Promise<{ likeUsers: Reaction[]; dislikeUsers: Reaction[] }> {
    const userReaction = await this.reactionModel
      .find({ post: postId })
      .populate({ path: 'user', select: '-hashedPassword' })
      .exec()
    const likeUsers = userReaction.filter((user) => user.reactionType === ReactionType.LIKE)
    const dislikeUsers = userReaction.filter((user) => user.reactionType === ReactionType.DISLIKE)
    return { likeUsers: likeUsers, dislikeUsers: dislikeUsers }
  }

  async getReactionByCommentId(commentId: string): Promise<{ likeUsers: Reaction[]; dislikeUsers: Reaction[] }> {
    const userReaction = await this.reactionModel
      .find({ comment: commentId })
      .populate({ path: 'user', select: '-hashedPassword' })
      .exec()
    const likeUsers = userReaction.filter((user) => user.reactionType === ReactionType.LIKE)
    const dislikeUsers = userReaction.filter((user) => user.reactionType === ReactionType.DISLIKE)
    return { likeUsers: likeUsers, dislikeUsers: dislikeUsers }
  }

  async removeReactionByPostId(postId: string) {
    return await this.reactionModel.deleteMany({ post: postId })
  }

  async removeReactionByCommentId(commentId: string) {
    return await this.reactionModel.deleteMany({ comment: commentId })
  }
}
