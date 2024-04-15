import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Comment } from '../../schemas/comment.schema';
import { CreateCommentDTO } from './dto/createComment.dto';
import { User } from '../../schemas/user.schema';
import { PostsService } from '../posts/posts.service';
import { UpdateCommentDTO } from './dto/updateComment.dto';
import { ReactionsService } from '../reactions/reactions.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    private readonly postsService: PostsService,
    private readonly reactionsService: ReactionsService,
  ) {}

  async createComment(
    user: User,
    createCommentDto: CreateCommentDTO,
  ): Promise<Comment> {
    const createdComment = new this.commentModel({
      ...createCommentDto,
      author: user,
    });
    const newComment = await (
      await (await createdComment.save()).populate('comment')
    ).populate('post');

    if (createdComment.comment) {
      // increment the comment count in parent comment
      this.updateNumComments(newComment.comment, 1);
    } else if (createdComment.post) {
      // increment the comment count in post
      this.postsService.changeNumComments(newComment.post, 1);
    }

    return newComment;
  }

  async updateNumComments(comment: Comment, changedCommentCount: number) {
    try {
      // Increment the numComments field
      const newNumComments = comment.numComments + changedCommentCount;

      // Use findOneAndUpdate to update the comment
      const updatedComment = await this.commentModel.findOneAndUpdate(
        { _id: comment._id } as FilterQuery<Comment>,
        { $set: { numComments: newNumComments } },
        { new: true },
      );

      // increment the comment count in parent comment or in post
      const thisComment = await this.getCommentById(comment._id.toString());
      if (thisComment.comment) {
        this.updateNumComments(thisComment.comment, changedCommentCount);
      } else if (thisComment.post) {
        this.postsService.changeNumComments(
          thisComment.post,
          changedCommentCount,
        );
        return updatedComment;
      }
    } catch (error) {
      // Handle errors
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ post: postId })
      .populate({ path: 'author', select: '-hashedPassword' })
      .populate('post')
      .exec();
  }

  async getCommentsWithReactByPostId(
    postId: string,
    userId: string,
  ): Promise<
    {
      data: Comment;
      like: boolean;
      dislike: boolean;
      numlikes: number;
      numdislikes: number;
    }[]
  > {
    const comments = await this.commentModel
      .find({ post: postId })
      .populate({ path: 'author', select: '-hashedPassword' })
      .populate('post')
      .exec();
    const transformedComments = await Promise.all(
      comments.map(async (comment) => {
        const listReactions =
          await this.reactionsService.getReactionByCommentId(
            comment._id.toString(),
          );
        const checkReactionStatus = userId
          ? await this.reactionsService.checkCommentReactionStatus(
              userId,
              comment._id.toString(),
            )
          : null;
        const like = checkReactionStatus === 'like' ? true : false;
        const dislike = checkReactionStatus === 'dislike' ? true : false;
        return {
          data: comment,
          like: like,
          dislike: dislike,
          numlikes: listReactions.likeUsers.length,
          numdislikes: listReactions.dislikeUsers.length,
        };
      }),
    );
    return transformedComments;
  }

  async getCommentsWithReactByCommentId(
    commentId: string,
    userId: string,
  ): Promise<
    {
      data: Comment;
      like: boolean;
      dislike: boolean;
      numlikes: number;
      numdislikes: number;
    }[]
  > {
    const comments = await this.commentModel
      .find({ comment: commentId })
      .populate({ path: 'author', select: '-hashedPassword' })
      .populate('comment')
      .populate('post')
      .exec();

    const transformedPosts = await Promise.all(
      comments.map(async (comment) => {
        const listReactions =
          await this.reactionsService.getReactionByCommentId(
            comment._id.toString(),
          );
        const checkReactionStatus = userId
          ? await this.reactionsService.checkCommentReactionStatus(
              userId,
              comment._id.toString(),
            )
          : null;
        const like = checkReactionStatus === 'like' ? true : false;
        const dislike = checkReactionStatus === 'dislike' ? true : false;
        return {
          data: comment,
          like: like,
          dislike: dislike,
          numlikes: listReactions.likeUsers.length,
          numdislikes: listReactions.dislikeUsers.length,
        };
      }),
    );
    return transformedPosts;
  }

  async getCommentsByComment(comment: Comment): Promise<Comment[]> {
    return this.commentModel
      .find({ comment: comment._id.toString() })
      .populate('comment')
      .populate('post')
      .exec();
  }

  async getCommentById(commentId: string): Promise<Comment> {
    const comment = await this.commentModel
      .findById(commentId)
      .populate({ path: 'author', select: '-hashedPassword' })
      .populate('comment')
      .populate('post');
    if (comment) {
      return comment;
    }
    throw new HttpException(
      'Post with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async updateCommentsById(
    user: User,
    commentId: string,
    updateCommentDto: UpdateCommentDTO,
  ): Promise<Comment> {
    const currentComment = await this.getCommentById(commentId);
    if (user.email === currentComment.author.email) {
      return this.commentModel
        .findByIdAndUpdate(commentId, updateCommentDto, { new: true })
        .exec();
    }
    throw new HttpException(
      'The comment has been updated by the author',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async removeComment(comment: Comment) {
    try {
      const listComments = await this.getCommentsByComment(comment);
      for (const eachComment of listComments) {
        this.removeComment(eachComment);
      }
      await this.reactionsService.removeReactionByCommentId(
        comment._id.toString(),
      );
      this.commentModel.findByIdAndRemove(comment._id).exec();
      return HttpStatus.OK;
    } catch (error) {
      throw error;
    }
  }

  async removeCommentById(user: User, commentId: string) {
    const currentComment = await this.getCommentById(commentId);
    const numCommentsDelete = -(currentComment.numComments + 1);
    if (user.email === currentComment.author.email) {
      // update numComments of parent comment
      if (currentComment.comment) {
        this.updateNumComments(currentComment.comment, numCommentsDelete);
      } else if (currentComment.post) {
        this.postsService.changeNumComments(
          currentComment.post,
          numCommentsDelete,
        );
      }
      // delete children comments and this comment
      return this.removeComment(currentComment);
    }
    throw new HttpException(
      'The comment has been deleted by the author',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async removeCommentsByPostId(user: User, postId: string) {
    try {
      const listComments = await this.getCommentsByPostId(postId);
      if (
        listComments.length > 0 &&
        user._id.toString() != listComments[0].post.author.toString()
      )
        throw new HttpException(
          'This comments have been deleted by the author of the post',
          HttpStatus.UNAUTHORIZED,
        );
      for (const eachComment of listComments) {
        this.removeComment(eachComment);
      }
      return HttpStatus.OK;
    } catch (error) {
      throw error;
    }
  }
}
