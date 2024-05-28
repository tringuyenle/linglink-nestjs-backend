import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { CreateQuestionDTO } from './dto/createQuestion.dto';
import { UpdateQuestionDTO } from './dto/updateQuestion.dto';
import { Question } from 'schemas/question.schema';
import { QuestionTypes } from '../common/enums/question.enum';
import { Types } from 'mongoose';
import { TagsService } from '../tags/tags.service';
import { getModelToken } from '@nestjs/mongoose';

describe('QuestionsController', () => {
  let controller: QuestionsController;
  let service: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        QuestionsService,
        TagsService,
        {
          provide: getModelToken('Question'),
          useValue: {
            new: jest.fn().mockResolvedValue({
              save: jest.fn().mockResolvedValue({
                id: '1',
                title: 'Test title',
                content: 'Test content',
              }),
            }),
            find: jest.fn().mockResolvedValue([]),
            findById: jest.fn().mockResolvedValue({
              populate: jest.fn().mockReturnThis(),
              exec: jest.fn().mockResolvedValue({
                id: '1',
                title: 'Test title',
                content: 'Test content',
              }),
            }),
            findByIdAndUpdate: jest.fn().mockResolvedValue({
              id: '1',
              title: 'Test title',
              content: 'Test content',
            }),
          },
        },
        {
          provide: getModelToken('Tag'),
          useValue: {
            new: jest.fn().mockResolvedValue({
              save: jest.fn().mockResolvedValue({ id: '1', name: 'Test tag' }),
            }),
            find: jest.fn().mockResolvedValue([]),
            findById: jest
              .fn()
              .mockResolvedValue({ id: '1', name: 'Test tag' }),
            findByIdAndUpdate: jest
              .fn()
              .mockResolvedValue({ id: '1', name: 'Test tag' }),
          },
        },
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createQuestion', () => {
    it('should create a question', async () => {
      const dto: CreateQuestionDTO = {
        content: 'Test content',
        answers: [],
        key: 0,
        audio_url: '',
      };
      const result: Question = {
        content: 'Test content',
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        type: QuestionTypes.MULTIPLE_CHOICE,
        tagsList: [],
        answers: [],
        key: 0,
        audio_url: '',
      };

      jest
        .spyOn(service, 'createQuestion')
        .mockImplementation(async () => result);

      expect(await controller.createQuestion(dto)).toBe(result);
    });
  });

  describe('getAllQuestions', () => {
    it('should get all questions', async () => {
      const result: Question[] = [
        {
          content: 'Test content',
          _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
          type: QuestionTypes.MULTIPLE_CHOICE,
          tagsList: [],
          answers: [],
          key: 0,
          audio_url: '',
        },
      ];

      jest
        .spyOn(service, 'getAllQuestions')
        .mockImplementation(async () => result);

      expect(await controller.getAllQuestions()).toBe(result);
    });
  });

  describe('getQuestionById', () => {
    it('should get a question by id', async () => {
      const id = '507f1f77bcf86cd799439011';
      const result = {
        content: 'Test content',
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        type: QuestionTypes.MULTIPLE_CHOICE,
        tagsList: [],
        answers: [],
        key: 0,
        audio_url: '',
      };

      jest
        .spyOn(service, 'getQuestionById')
        .mockImplementation(async () => result);

      expect(await controller.getQuestionById(id)).toBe(result);
    });
  });

  describe('updateQuestionById', () => {
    it('should update a question by id', async () => {
      const id = '507f1f77bcf86cd799439011';
      const dto: UpdateQuestionDTO = {
        content: 'Updated content',
        answers: [],
        key: 0,
        audio_url: '',
      };
      const result = {
        content: 'Test content',
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        type: QuestionTypes.MULTIPLE_CHOICE,
        tagsList: [],
        answers: [],
        key: 0,
        audio_url: '',
      };

      jest
        .spyOn(service, 'updateQuestionById')
        .mockImplementation(async () => result);

      expect(await controller.updateQuestionById(id, dto)).toBe(result);
    });
  });

  describe('removeQuestionById', () => {
    it('should remove a question by id', async () => {
      const id = '507f1f77bcf86cd799439011';

      jest.spyOn(service, 'removeQuestionById').mockImplementation(async () => {
        return;
      });

      expect(await controller.removeQuestionById(id)).toBe(undefined);
    });
  });
});
