import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlashcardController } from './flashcards.controller';
import { FlashcardService } from './flashcards.service';
import { Flashcard, FlashcardSchema } from '../../schemas/flashcard.schema';
import { FlashcardListModule } from '../flashcard-list/flashcard-list.module';
import { FlashcardListService } from '../flashcard-list/flashcard-list.service';
import {
  FlashcardList,
  FlashcardListSchema,
} from '../../schemas/flashcard-list.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Flashcard.name, schema: FlashcardSchema },
      { name: FlashcardList.name, schema: FlashcardListSchema },
    ]),
    FlashcardListModule,
  ],
  controllers: [FlashcardController],
  providers: [FlashcardService, FlashcardListService],
  exports: [FlashcardService],
})
export class FlashcardModule {}
