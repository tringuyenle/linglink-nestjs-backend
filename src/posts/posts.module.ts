import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostSchema } from '../../schemas/post.schema';
import { TopicSchema } from '../../schemas/topic.schema';
import { TopicsService } from '../topics/topics.service';
import { QuestionsService } from '../questions/questions.service';
import { QuestionSchema } from '../../schemas/question.schema';
import { TagsService } from '../tags/tags.service';
import { TagSchema } from '../../schemas/tag.schema';
import { ReactionsService } from '../reactions/reactions.service';
import { ReactionSchema } from '../../schemas/reaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
      { name: 'Topic', schema: TopicSchema },
      { name: 'Question', schema: QuestionSchema },
      { name: 'Tag', schema: TagSchema },
      { name: 'Reaction', schema: ReactionSchema },
    ]),
  ],
  providers: [
    PostsService,
    TopicsService,
    QuestionsService,
    TagsService,
    ReactionsService,
  ],
  controllers: [PostsController],
})
export class PostsModule {}
