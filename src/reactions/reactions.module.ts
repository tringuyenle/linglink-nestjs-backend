import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReactionSchema } from '../../schemas/reaction.schema';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reaction', schema: ReactionSchema }]),
  ],
  providers: [ReactionsService],
  controllers: [ReactionsController],
})
export class ReactionsModule {}
