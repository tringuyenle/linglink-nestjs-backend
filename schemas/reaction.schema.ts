import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum } from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { ReactionType } from '../src/common/enums/reaction.enum';
import { Post } from './post.schema';
import { User } from './user.schema';
import { Comment } from './comment.schema';

@Schema({ timestamps: true })
export class Reaction {
    _id: ObjectId;

    @Prop({ type: String, enum: ReactionType })
    @IsEnum(ReactionType)
    reactionType: ReactionType;

    @Prop({ type: Types.ObjectId, ref: 'Comment' })
    comment: Comment;

    @Prop({ type: Types.ObjectId, ref: 'Post' })
    post: Post;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: User;
};

export const ReactionSchema = SchemaFactory.createForClass(Reaction);