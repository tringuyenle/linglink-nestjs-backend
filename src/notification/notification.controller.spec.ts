import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { Types } from 'mongoose';
import { HttpStatus } from '@nestjs/common';

jest.mock('./notification.service');

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [NotificationService, MyJwtGuard],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get', () => {
    it('should return a list of notifications', async () => {
      const result: any = [
        {
          sender: new Types.ObjectId('65e749feb24791111125d619'),
          receiver: new Types.ObjectId('65a5496ea9d202175a3af0af'),
          title: 'Title test',
          content: 'Content test',
        },
      ]; // Replace 'test' with an actual NotificationDocument object
      jest
        .spyOn(service, 'getNotificationByUserId')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.get({ user: 'testUser' }, 'lastNoti')).toBe(
        result,
      );
    });
  });
  describe('create', () => {
    it('should create a notification', async () => {
      const result = HttpStatus.CREATED;
      const createNotificationDto: CreateNotificationDto = {
        receiver: 'some-receiver-id',
        title: 'Some Title',
        content: 'Some content',
      };

      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve<HttpStatus>(result));

      expect(
        await controller.create({ user: 'testUser' }, createNotificationDto),
      ).toBe(result);
    });
  });
});
