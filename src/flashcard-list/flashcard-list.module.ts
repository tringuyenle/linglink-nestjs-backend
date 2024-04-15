import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlashcardListController } from './flashcard-list.controller';
import { FlashcardListService } from './flashcard-list.service';
import {
  FlashcardList,
  FlashcardListSchema,
} from '../../schemas/flashcard-list.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FlashcardList.name, schema: FlashcardListSchema },
    ]),
  ],
  controllers: [FlashcardListController],
  providers: [FlashcardListService],
  exports: [FlashcardListService],
})
export class FlashcardListModule {}
