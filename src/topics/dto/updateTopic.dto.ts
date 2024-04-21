import { IsEmail, IsNotEmpty } from 'class-validator';
import { Post } from '../../../schemas/post.schema';

export class UpdateTopicDTO {
  @IsNotEmpty()
  topicName: string;

  postsList: Post[];

  createdAt: Date;

  updatedAt: Date;
}
