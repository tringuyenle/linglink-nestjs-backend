import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { Post } from '../../schemas/post.schema';
import { CreatePostDTO } from './dto/createPost.dto';
import { UpdatePostDTO } from './dto/updatePost.dto';
import { TopicsService } from '../topics/topics.service';
import { QuestionsService } from '../questions/questions.service';
import { ReactionsService } from '../reactions/reactions.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    private readonly topicsService: TopicsService,
    private readonly questionsService: QuestionsService,
    private readonly reactionsService: ReactionsService,
  ) {}

  async createPost(user: User, postsData: CreatePostDTO) {
    try {
      const topic = await this.topicsService.getTopicById(postsData.topicID);
      if (!topic) {
        throw new NotFoundException('Topic not found');
      }
      let question = null;
      if (postsData.question) {
        question = new Types.ObjectId(postsData.question);
      } else if (postsData.newQuestion) {
        question = await this.questionsService.createQuestion(
          postsData.newQuestion,
        );
      }

      const newPost = await this.postModel.create({
        ...postsData,
        author: user,
        topic: topic,
        question: question,
        createAt: Date.now(),
      });

      await newPost.save();

      if (topic) {
        await this.topicsService.addNewPostIntoTopicById(
          postsData.topicID,
          newPost,
        );
      }

      return newPost;
    } catch (error) {
      // Trả về lỗi cho người dùng
      throw new HttpException(
        'Failed to create post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllPosts() {
    return await this.postModel
      .find()
      .populate({ path: 'author', select: '-hashedPassword' })
      .populate('question')
      .populate('topic')
      .exec();
  }

  async getPostById(postId: string) {
    const post = await this.postModel
      .findById(postId)
      .populate('question')
      .populate('topic')
      .populate({ path: 'author', select: '-hashedPassword' })
      .exec();
    if (post) {
      return post;
    }
    throw new HttpException(
      'Post with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getPostWithReactById(userId: string, postId: string) {
    const post = await this.postModel
      .findById(postId)
      .populate({ path: 'author', select: '-hashedPassword' })
      .exec();

    if (post) {
      const listReactions = await this.reactionsService.getReactionByPostId(
        post._id.toString(),
      );
      const checkReactionStatus = userId
        ? await this.reactionsService.checkPostReactionStatus(
            userId,
            post._id.toString(),
          )
        : null;
      const like = checkReactionStatus === 'like' ? true : false;
      const dislike = checkReactionStatus === 'dislike' ? true : false;
      return {
        data: post,
        like: like,
        dislike: dislike,
        numlikes: listReactions.likeUsers.length,
        numdislikes: listReactions.dislikeUsers.length,
      };
    }
    throw new HttpException(
      'Post with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getPostByTopic(topicId: string) {
    const topic = await this.topicsService.getTopicById(topicId);
    if (topic) {
      return topic.postsList;
    }
    throw new HttpException(
      'Post with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async updatePostById(user: User, postId: string, postsData: UpdatePostDTO) {
    const currentPost = await this.getPostById(postId);
    let newQuestion: any = '';
    if (!currentPost.question && postsData.question) {
      newQuestion = await this.questionsService.createQuestion(
        postsData.question,
      );
    } else if (postsData.question) {
      await this.questionsService.updateQuestionById(
        postsData.question._id?.toString(),
        {
          content: postsData.question.content,
          answer: postsData.question.answers,
          key: postsData.question.key,
          audio_url: postsData.question.audio_url,
        },
      );
    }
    const newData: any = { ...postsData };

    if (newQuestion !== '') {
      newData.question = newQuestion;
    } else {
      if (!currentPost.question) newData.question = null;
    }

    if (user.email === currentPost.author.email) {
      return await this.postModel.findOneAndUpdate(
        { _id: postId } as FilterQuery<Post>,
        newData,
        { new: true },
      );
    } else {
      throw new HttpException(
        'The post has been updated by the author',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async removePostById(user: User, postId: string) {
    const currentPost = await this.getPostById(postId);
    if (user.email === currentPost.author.email) {
      await this.topicsService.deletePostInTopicById(
        currentPost.topic.toString(),
        currentPost,
      );
      await this.reactionsService.removeReactionByPostId(
        currentPost.id.toString(),
      );
      return await this.postModel.deleteOne({
        _id: postId,
      } as FilterQuery<Post>);
    }
    return new HttpException(
      'The post has been deleted by the author',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async getAllPostsByPage(
    lastPostId: string,
    pageSize: number,
  ): Promise<Post[]> {
    const query = {};

    if (lastPostId) {
      // Nếu có lastPostId, thêm điều kiện lọc để chỉ lấy bài viết có _id nhỏ hơn lastPostId
      query['_id'] = { $lt: lastPostId };
    }

    const posts = await this.postModel
      .find(query)
      .sort({ _id: -1 })
      .limit(pageSize)
      .populate('author')
      .populate('question')
      .populate('topic')
      .exec();

    return posts;
  }

  async getAllPostsByPagev2(
    lastPostTime: Date,
    userId: string,
    pageSize: number,
    topic: string,
    author: string,
    lastFetchTime: Date,
  ): Promise<
    {
      data: Post;
      like: boolean;
      dislike: boolean;
      numlikes: number;
      numdislikes: number;
      author: string;
    }[]
  > {
    const query: any = {};

    if (author) {
      query.author = new Types.ObjectId(author);
    }

    // If lastFetchTime is provided, fetch posts that were created after it
    if (lastFetchTime) {
      query.createdAt = { $gt: lastFetchTime };
    }

    // if (lastPostId) {
    //   query._id = { $lt: lastPostId };
    // }

    // If no new posts, fetch older posts
    if (
      !lastFetchTime ||
      (lastFetchTime && (await this.postModel.countDocuments(query)) === 0)
    ) {
      delete query.createdAt;
      if (lastPostTime) {
        query.createdAt = { $lt: lastPostTime };
      }
    }

    if (topic) {
      query.topic = new Types.ObjectId(topic);
    }

    const posts = await this.postModel
      .find(query)
      .sort({ _id: -1 })
      .limit(pageSize)
      .populate('author')
      .populate('question')
      .populate('topic')
      .exec();
    // Sử dụng hàm map để chuyển đổi cấu trúc của mỗi phần tử trong mảng và cập nhật trạng thái reaction
    const transformedPosts: any = await Promise.all(
      posts.map(async (post) => {
        const listReactions = await this.reactionsService.getReactionByPostId(
          post._id.toString(),
        );
        const checkReactionStatus = userId
          ? await this.reactionsService.checkPostReactionStatus(
              userId,
              post._id.toString(),
            )
          : null;
        const like = checkReactionStatus === 'like' ? true : false;
        const dislike = checkReactionStatus === 'dislike' ? true : false;
        return {
          data: post,
          like: like,
          dislike: dislike,
          numlikes: listReactions.likeUsers.length,
          numdislikes: listReactions.dislikeUsers.length,
          author: post.author, // Có thể bạn cần chỉnh sửa ở đây nếu post.author không chứa thông tin về tên tác giả
        };
      }),
    );

    return transformedPosts;
  }

  async changeNumComments(post: Post, changedCommentCount: number) {
    try {
      // Increment the numComments field
      const newNumComments = post.numComments + changedCommentCount;

      // Use findOneAndUpdate to update the document
      const updatedPost = await this.postModel.findOneAndUpdate(
        { _id: post._id } as FilterQuery<Post>,
        { $set: { numComments: newNumComments } },
        { new: true },
      );

      return updatedPost;
    } catch (error) {
      // Handle errors
      throw error;
    }
  }
}
