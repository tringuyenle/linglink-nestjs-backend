// flashcard/flashcard.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Flashcard } from '../../schemas/flashcard.schema';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { FlashcardListService } from '../flashcard-list/flashcard-list.service';
import { ChangeFlashcardStateDto } from '../flashcard-list/dto/change-flashcard-state.dto';

@Injectable()
export class FlashcardService {
  constructor(
    @InjectModel(Flashcard.name) private flashcardModel: Model<Flashcard>,
    private readonly flashcardListService: FlashcardListService,
  ) {}

  async changeFlashcardState(
    changeFlashcardStateDto: ChangeFlashcardStateDto,
  ): Promise<Flashcard> {
    const flashcard = await this.flashcardModel.findById(
      changeFlashcardStateDto.id,
    );
    if (flashcard) {
      flashcard.status = changeFlashcardStateDto.state;
    }
    return await flashcard.save();
  }

  async createFlashcard(
    user: any,
    createFlashcardDto: CreateFlashcardDto,
  ): Promise<Flashcard> {
    // Step 1: Tạo Flashcard mới
    const createdFlashcard = new this.flashcardModel({
      ...createFlashcardDto,
      author: user._id,
      createAt: new Date(),
    });

    // Step 2: Thêm Flashcard vào FlashcardList
    const flashcardList = await this.flashcardListService.findOne(
      createFlashcardDto.flashcardListId,
    );
    if (!flashcardList) {
      throw new Error('FlashcardList not found');
    } else {
      const flashcardId =
        createdFlashcard._id instanceof Types.ObjectId
          ? createdFlashcard._id
          : new Types.ObjectId(String(createdFlashcard._id));
      flashcardList.flashcards.push(flashcardId);
    }
    await flashcardList.save();
    return createdFlashcard.save();
  }
  async isFlashcardBelongsToUser(
    flashcardId: string,
    userId: string,
  ): Promise<boolean> {
    const flashcard = await this.flashcardModel.findById(flashcardId).exec();

    if (!flashcard) {
      throw new NotFoundException('Flashcard not found');
    }
    return flashcard.author.toString() === userId.toString();
  }
  async deleteFlashcardAndRemoveFromList(
    flashcardId: string,
    flashcardListId: string,
    userId: string,
  ): Promise<void> {
    // Kiểm tra xem flashcard có thuộc về người dùng hay không
    const isBelongsToUser = await this.isFlashcardBelongsToUser(
      flashcardId,
      userId,
    );
    if (!isBelongsToUser) {
      throw new ForbiddenException('Flashcard does not belong to the user');
    }

    // Loại bỏ flashcard khỏi danh sách flashcards của flashcard list
    const flashcardList =
      await this.flashcardListService.findOne(flashcardListId);
    if (!flashcardList) {
      throw new NotFoundException('FlashcardList not found');
    }
    const flashcardIndex = flashcardList.flashcards.findIndex(
      (flashcard) => flashcard._id.toString() === flashcardId,
    );
    if (flashcardIndex !== -1) {
      flashcardList.flashcards.splice(flashcardIndex, 1);
      await flashcardList.save();
    } else {
      throw new NotFoundException('Flashcard not found in FlashcardList');
    }
    // Xóa flashcard
    await this.flashcardModel.findByIdAndRemove(flashcardId).exec();
  }
}
