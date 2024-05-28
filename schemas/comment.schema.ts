import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Post } from './post.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Comment {
  _id: Types.ObjectId;

  @Prop()
  content: string;

  @Prop({ default: 0 })
  numComments: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post: Post;

  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  comment: Comment;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
