import { Test, TestingModule } from '@nestjs/testing';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';

jest.mock('./chats.service');

describe('ChatsController', () => {
  let controller: ChatsController;
  let service: ChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsController],
      providers: [ChatsService, MyJwtGuard],
    }).compile();

    controller = module.get<ChatsController>(ChatsController);
    service = module.get<ChatsService>(ChatsService);
  });

  it('should call createSocketToken with correct parameters', async () => {
    const req = { user: { id: 'testId' } };
    const serviceSpy = jest.spyOn(service, 'createSocketToken');

    await controller.createSocketToken(req);

    expect(serviceSpy).toHaveBeenCalledWith(req.user);
  });

  it('should call getChatRoom with correct parameters', async () => {
    const req = { user: { id: 'testId' } };
    const serviceSpy = jest.spyOn(service, 'getChatRoom');

    await controller.getChatRoom(req);

    expect(serviceSpy).toHaveBeenCalledWith(req.user);
  });
});