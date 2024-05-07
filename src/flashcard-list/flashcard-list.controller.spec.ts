import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardListController } from './flashcard-list.controller';
import { FlashcardListService } from './flashcard-list.service';
import { CreateFlashcardListDto } from './dto/create-flashcard-list.dto';
import { FlashcardList } from 'schemas/flashcard-list.schema';
import { ClientSession } from 'mongodb';
import { Document, Model, DocumentSetOptions, QueryOptions, UpdateQuery, AnyObject, PopulateOptions, MergeType, Query, SaveOptions, ToObjectOptions, FlattenMaps, Require_id, UpdateWithAggregationPipeline, pathsToSkip, Error, Types } from 'mongoose';

jest.mock('./flashcard-list.service');

describe('FlashcardListController', () => {
  let controller: FlashcardListController;
  let service: FlashcardListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardListController],
      providers: [FlashcardListService],
    }).compile();

    controller = module.get<FlashcardListController>(FlashcardListController);
    service = module.get<FlashcardListService>(FlashcardListService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createFlashcardList', () => {
    it('should create a flashcard list', async () => {
      const dto: CreateFlashcardListDto = {
        name: ''
      };
      const result: any = {
        _id: new Types.ObjectId(),
        name: '',
        flashcards: [],
        author: new Types.ObjectId(),
        createAt: undefined,
      };
      jest.spyOn(service, 'createFlashcardList').mockResolvedValue(result);

      expect(await controller.createFlashcardList({ user: {} }, dto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of flashcard lists', async () => {
      const result: FlashcardList[] = [/* fill with appropriate data */];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a flashcard list', async () => {
      const result: any = {
        _id: new Types.ObjectId(),
        name: '',
        flashcards: [],
        author: new Types.ObjectId(),
        createAt: undefined,
      };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return a flashcard list', async () => {
      const dto: Partial<FlashcardList> = { /* fill with appropriate data */ };
      const result: any = {
        _id: new Types.ObjectId(),
        name: '',
        flashcards: [],
        author: new Types.ObjectId(),
        createAt: undefined,
      };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', dto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove and return a flashcard list', async () => {
      const result: any = {
        _id: new Types.ObjectId(),
        name: '',
        flashcards: [],
        author: new Types.ObjectId(),
        createAt: undefined,
      };
      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
    });
  });

  describe('removeFlashcardFromList', () => {
    it('should remove a flashcard from a list and return the list', async () => {
      const result: any = {
        _id: new Types.ObjectId(),
        name: '',
        flashcards: [],
        author: new Types.ObjectId(),
        createAt: undefined,
      };
      jest.spyOn(service, 'removeFlashcardFromList').mockResolvedValue(result);

      expect(await controller.removeFlashcardFromList('1', '1')).toBe(result);
    });
  });

  describe('getFlashCardList', () => {
    it('should return a list of flashcards and total count', async () => {
      const result = { flashcardLists: [/* fill with appropriate data */], total: 1 };
      jest.spyOn(service, 'getFlashCardListByUserId').mockResolvedValue(result);

      expect(await controller.getFlashCardList({ user: {} }, 1, 10, 1)).toBe(result);
    });
  });
});