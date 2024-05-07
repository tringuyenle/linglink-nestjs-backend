import { Test, TestingModule } from '@nestjs/testing';
import { RequestAddFriendController } from './request-add-friend.controller';
import { RequestAddFriendService } from './request-add-friend.service';
import { RequestDto } from './dto/request.dto';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { NewRequestDto } from './dto/newRequest.dto';

describe('RequestAddFriendController', () => {
  let controller: RequestAddFriendController;
  let service: RequestAddFriendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestAddFriendController],
      providers: [
        {
          provide: RequestAddFriendService,
          useValue: {
            createRequest: jest.fn().mockResolvedValue('createRequestResult'),
            acceptRequest: jest.fn().mockResolvedValue('acceptRequestResult'),
            denyRequest: jest.fn().mockResolvedValue('denyRequestResult'),
            getRequestList: jest.fn().mockResolvedValue('getRequestListResult'),
          },
        },
        MyJwtGuard,
      ],
    }).compile();

    controller = module.get<RequestAddFriendController>(RequestAddFriendController);
    service = module.get<RequestAddFriendService>(RequestAddFriendService);
  });

  it('should call createRequest with correct parameters and return the result', async () => {
    const req = { user: 'testUser' };
    const newRequestDto: NewRequestDto = { receiver: '123' };
    const result = await controller.createRequest(req, newRequestDto);
    expect(service.createRequest).toHaveBeenCalledWith(req.user, newRequestDto);
    expect(result).toBe('createRequestResult');
  });

  it('should call acceptRequest with correct parameters and return the result', async () => {
    const req = { user: 'testUser' };
    const requestDto: RequestDto = { request: '789' };
    const result = await controller.acceptRequest(req, requestDto);
    expect(service.acceptRequest).toHaveBeenCalledWith(req.user, requestDto);
    expect(result).toBe('acceptRequestResult');
  });

  it('should call denyRequest with correct parameters and return the result', async () => {
    const req = { user: 'testUser' };
    const requestDto: RequestDto = { request: '789' };
    const result = await controller.denyRequest(req, requestDto);
    expect(service.denyRequest).toHaveBeenCalledWith(req.user, requestDto);
    expect(result).toBe('denyRequestResult');
  });

  it('should call getRequestList with correct parameters and return the result', async () => {
    const req = { user: 'testUser' };
    const result = await controller.getRequestList(req);
    expect(service.getRequestList).toHaveBeenCalledWith(req.user);
    expect(result).toBe('getRequestListResult');
  });
});