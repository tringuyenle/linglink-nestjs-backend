// flashcard/flashcard.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { FlashcardService } from './flashcards.service';
import { ChangeFlashcardStateDto } from 'src/flashcard-list/dto/change-flashcard-state.dto';

@Controller('flashcards')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashcardService) {}

  @Post()
  @UseGuards(MyJwtGuard)
  createFlashcard(@Req() req, @Body() createFlashcardDto: CreateFlashcardDto) {
    return this.flashcardService.createFlashcard(req.user, createFlashcardDto);
  }

  @Post('/changestate')
  @UseGuards(MyJwtGuard)
  changeFlashcardState(
    @Body() changeFlashcardStateDto: ChangeFlashcardStateDto,
  ) {
    return this.flashcardService.changeFlashcardState(changeFlashcardStateDto);
  }

  @Delete(':flashcardId/:flashcardListId')
  @UseGuards(MyJwtGuard)
  async deleteFlashcardAndRemoveFromList(
    @Req() req,
    @Param('flashcardId') flashcardId: string,
    @Param('flashcardListId') flashcardListId: string,
  ) {
    const userId = req.user._id;
    await this.flashcardService.deleteFlashcardAndRemoveFromList(
      flashcardId,
      flashcardListId,
      userId,
    );
  }
}
