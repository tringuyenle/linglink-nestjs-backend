import { IsNotEmpty } from 'class-validator';
import { Post } from '../../../schemas/post.schema';

export class CreateTopicDTO {
  @IsNotEmpty()
  topicName: string;

  postsList: Post[];

  createdAt: Date;

  updatedAt: Date;
}
