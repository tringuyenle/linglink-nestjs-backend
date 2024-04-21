import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicSchema } from '../../schemas/topic.schema';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Topic', schema: TopicSchema }]),
  ],
  providers: [TopicsService],
  controllers: [TopicsController],
})
export class TopicsModule {}
