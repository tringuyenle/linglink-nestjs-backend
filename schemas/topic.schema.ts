import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { Post } from './post.schema';

@Schema({ timestamps: true })
export class Topic {
  _id: ObjectId;

  @Prop()
  topicName: string;

  @Prop({ type: [Types.ObjectId], ref: 'Post' })
  postsList: Post[];
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
