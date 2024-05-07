import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { UpdateQuestionIntoProgressDto } from './dto/update-question-into-progress.dto';
import { User } from '../../schemas/user.schema';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProgressDocument } from '../../schemas/progress.schema';

describe('ProgressController', () => {
  let controller: ProgressController;
  let service: ProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgressController],
      providers: [
        ProgressService,
        {
          provide: getModelToken('Progress'),
          // provide a mock implementation if needed
          useValue: {},
        },
        {
          provide: getModelToken('User'),
          // provide a mock implementation if needed
          useValue: {},
        },
        // add other dependencies here
      ],
    }).compile();
  
    controller = module.get<ProgressController>(ProgressController);
    service = module.get<ProgressService>(ProgressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProgressByUserId', () => {
    it('should return a progress', async () => {
        const result: ProgressDocument[] = [{
            user: new User(),
            date: new Date(),
            wrongAnswerQuestions: [],
            totalQuestions: [],
        } as ProgressDocument]; // Add 'as ProgressDocument' to cast the object literal to ProgressDocument

        jest.spyOn(service, 'getProgressByUserId').mockImplementation(() => Promise.resolve(result));

        expect(await controller.getProgressByUserId('1')).toBe(result);
    });
  });

  describe('updateQuestionInProgress', () => {
    it('should update a question in progress', async () => {
        const result: HttpStatus = HttpStatus.OK;
        const dto: UpdateQuestionIntoProgressDto = { questionId: '1', isCorrect: true };
        jest.spyOn(service, 'updateQuestionInProgress').mockImplementation(() => Promise.resolve(result));

        expect(await controller.updateQuestionInProgress({ user: '1' }, dto)).toBe(result);
    });
  });
});
