import { IsNotEmpty } from 'class-validator';
import { CreateQuestionDTO } from '../../questions/dto/createQuestion.dto';

export class CreatePostDTO {
  topicID: string;

  @IsNotEmpty()
  content: string;

  question: string;

  newQuestion: CreateQuestionDTO;

  imgs_url: [string];

  audio_url: string;
}
