export class UpdateQuestionDTO {
  tagsListId?: string[];

  content: string;

  answers: string[];

  key: number;

  img_url?: string;

  audio_url: string;
}
