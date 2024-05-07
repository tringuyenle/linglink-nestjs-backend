import { Test, TestingModule } from '@nestjs/testing';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { CreateTopicDTO } from './dto/createTopic.dto';
import { UpdateTopicDTO } from './dto/updateTopic.dto';

describe('TopicsController', () => {
  let controller: TopicsController;
  let service: TopicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicsController],
      providers: [
        {
          provide: TopicsService,
          useValue: {
            createTopic: jest.fn(),
            getAllTopics: jest.fn(),
            getTopicById: jest.fn(),
            updateTopicById: jest.fn(),
            removeTopicById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TopicsController>(TopicsController);
    service = module.get<TopicsService>(TopicsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTopic', () => {
    it('should call service.createTopic with correct parameters', async () => {
      const dto: CreateTopicDTO = {
        topicName: 'someTopicName',
        postsList: [], // assuming postsList is an array, adjust as needed
        createdAt: new Date(),
        updatedAt: new Date(),
      };;
      await controller.createTopic(dto);
      expect(service.createTopic).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllTopics', () => {
    it('should call service.getAllTopics', async () => {
      await controller.getAllTopics();
      expect(service.getAllTopics).toHaveBeenCalled();
    });
  });

  describe('getTopicById', () => {
    it('should call service.getTopicById with correct parameters', async () => {
      const id = 'someId';
      await controller.getTopicById(id);
      expect(service.getTopicById).toHaveBeenCalledWith(id);
    });
  });

  describe('updateTopicById', () => {
    it('should call service.updateTopicById with correct parameters', async () => {
      const id = 'someId';
      const dto: UpdateTopicDTO = {
        topicName: 'someTopicName',
        postsList: [], // assuming postsList is an array, adjust as needed
        createdAt: new Date(),
        updatedAt: new Date(),
      };;
      await controller.updateTopicById(id, dto);
      expect(service.updateTopicById).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('removeTopicById', () => {
    it('should call service.removeTopicById with correct parameters', async () => {
      const id = 'someId';
      await controller.removeTopicById(id);
      expect(service.removeTopicById).toHaveBeenCalledWith(id);
    });
  });
});