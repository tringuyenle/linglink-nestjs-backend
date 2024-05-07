import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardController } from './flashcards.controller';
import { FlashcardService } from './flashcards.service';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { ChangeFlashcardStateDto } from '../flashcard-list/dto/change-flashcard-state.dto';

describe('FlashcardController', () => {
  let controller: FlashcardController;
  let service: FlashcardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardController],
      providers: [
        {
          provide: FlashcardService,
          useValue: {
            createFlashcard: jest.fn(),
            changeFlashcardState: jest.fn(),
            deleteFlashcardAndRemoveFromList: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FlashcardController>(FlashcardController);
    service = module.get<FlashcardService>(FlashcardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createFlashcard', () => {
    it('should call service with correct parameters', async () => {
      const dto = new CreateFlashcardDto();
      const req = { user: { _id: 'testId' } };
      await controller.createFlashcard(req, dto);
      expect(service.createFlashcard).toHaveBeenCalledWith(req.user, dto);
    });
  });

  describe('changeFlashcardState', () => {
    it('should call service with correct parameters', async () => {
      const dto = new ChangeFlashcardStateDto();
      await controller.changeFlashcardState(dto);
      expect(service.changeFlashcardState).toHaveBeenCalledWith(dto);
    });
  });

  describe('deleteFlashcardAndRemoveFromList', () => {
    it('should call service with correct parameters', async () => {
      const req = { user: { _id: 'testId' } };
      const flashcardId = 'flashcardId';
      const flashcardListId = 'flashcardListId';
      await controller.deleteFlashcardAndRemoveFromList(req, flashcardId, flashcardListId);
      expect(service.deleteFlashcardAndRemoveFromList).toHaveBeenCalledWith(flashcardId, flashcardListId, req.user._id);
    });
  });
});