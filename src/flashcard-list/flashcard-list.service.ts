import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlashcardList } from '../../schemas/flashcard-list.schema';
import { CreateFlashcardListDto } from './dto/create-flashcard-list.dto';

@Injectable()
export class FlashcardListService {
  constructor(
    @InjectModel(FlashcardList.name)
    private readonly flashcardListModel: Model<FlashcardList>,
  ) {}

  async createFlashcardList(
    user: any,
    createFlashcardListDto: CreateFlashcardListDto,
  ): Promise<FlashcardList> {
    const createdFlashcardList = new this.flashcardListModel({
      ...createFlashcardListDto,
      createAt: Date.now(),
      author: user._id, // Gán ID của người dùng làm author của danh sách flashcard
    });
    return createdFlashcardList.save();
  }

  async findAll(): Promise<FlashcardList[]> {
    return this.flashcardListModel
      .find()
      .populate({ path: 'author', select: '-hashedPassword' })
      .populate({
        path: 'flashcards',
        select: '-author', // Không select trường author trong mỗi flashcard
      })
      .exec();
  }

  async findOne(id: string): Promise<FlashcardList> {
    return this.flashcardListModel
      .findById(id)
      .populate({ path: 'author', select: '-hashedPassword' })
      .populate({
        path: 'flashcards',
        select: '-author', // Không select trường author trong mỗi flashcard
      })
      .exec();
  }

  async update(
    id: string,
    updateFlashcardListDto: Partial<FlashcardList>,
  ): Promise<FlashcardList> {
    return this.flashcardListModel
      .findByIdAndUpdate(id, updateFlashcardListDto, { new: true })
      .populate({ path: 'author', select: '-hashedPassword' })
      .populate({
        path: 'flashcards',
        select: '-author', // Không select trường author trong mỗi flashcard
      })
      .exec();
  }

  async remove(id: string): Promise<FlashcardList> {
    return this.flashcardListModel
      .findByIdAndRemove(id)
      .populate({ path: 'author', select: '-hashedPassword' })
      .populate({
        path: 'flashcards',
        select: '-author', // Không select trường author trong mỗi flashcard
      })
      .exec();
  }

  async removeFlashcardFromList(
    listId: string,
    flashcardId: string,
  ): Promise<FlashcardList> {
    const flashcardList = await this.flashcardListModel.findById(listId);
    flashcardList.flashcards = flashcardList.flashcards.filter(
      (flashcard) => flashcard._id.toString() !== flashcardId,
    );
    return flashcardList.save();
  }

  async getFlashCardListByUserId(
    user: any,
    page?: number,
    pageSize?: number,
    id?: number,
  ): Promise<{ flashcardLists: FlashcardList[]; total: number }> {
    let query = this.flashcardListModel
      .find({ author: user._id })
      .populate({ path: 'author', select: '-hashedPassword' })
      .populate({
        path: 'flashcards',
        select: '-author',
      });
    if (page && pageSize) {
      const skip = (page - 1) * pageSize;
      query = query.skip(skip).limit(pageSize);
      const flashcardLists = await query.exec();
      return { flashcardLists, total: flashcardLists.length };
    } else {
      if (id) {
        query = query.find({ _id: id });
      }
      const flashcardLists = await query.exec();
      return { flashcardLists, total: flashcardLists.length };
    }
  }
}
