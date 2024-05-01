import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { Question } from './question.schema';
import { Topic } from './topic.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Post {
  _id: ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Topic' })
  topic: Topic;

  @Prop()
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Question' })
  question: Question;

  @Prop()
  imgs_url: [string];

  @Prop()
  createAt: Date;

  @Prop({ default: 0 })
  numComments: number;

  // @Prop({ default: 0 })
  // upVotes: number;

  // @Prop({ type: Types.ObjectId, ref: 'User' })
  // upVotesList: User[];

  // @Prop({ default: 0 })
  // downVotes: number;

  // @Prop({ type: Types.ObjectId, ref: 'User' })
  // downVotesList: User[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
