import { Test, TestingModule } from '@nestjs/testing';
import { ProgressService } from './progress.service';
import { getModelToken } from '@nestjs/mongoose';
import { Progress } from '../../schemas/progress.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

describe('ProgressService', () => {
  let service: ProgressService;
  let model: Model<Progress>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        {
          provide: getModelToken('Progress'),
          useValue: {
            new: jest.fn().mockResolvedValue({
              user: '507f1f77bcf86cd799439011',
              date: new Date(),
              wrongAnswerQuestions: [],
              totalQuestions: [],
            }),
            find: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnThis(),
              exec: jest.fn().mockResolvedValue([{
                user: '507f1f77bcf86cd799439011',
                date: new Date(),
                wrongAnswerQuestions: [],
                totalQuestions: [],
              }]),
            }),
            findOne: jest.fn(),
            updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
          },
        },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
    model = module.get<Model<Progress>>(getModelToken('Progress'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProgressByUserId', () => {
    it('should get a progress by user id', async () => {
      const userId = '507f1f77bcf86cd799439011';

      const result = await service.getProgressByUserId(userId);

      expect(result[0].user).toEqual(userId);
      expect(result[0].date).toBeDefined();
      expect(result[0].wrongAnswerQuestions).toEqual([]);
      expect(result[0].totalQuestions).toEqual([]);
    });
  });

  describe('updateQuestionInProgress', () => {
    it('should throw an error if progress not found', async () => {
      const userId = '507f1f77bcf86cd799429011';
      const questionId = '507f1f77bcf86cd799439011';
      const isCorrect = true;

      (model.findOne as jest.Mock).mockResolvedValue(null);  

      await expect(service.updateQuestionInProgress(userId, questionId, isCorrect)).rejects.toThrow('Failed to update progress');
    });
  });
});
