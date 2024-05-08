import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getByUserEmail: jest.fn().mockResolvedValue('getByUserEmailResult'),
            searchByName: jest.fn().mockResolvedValue('searchByNameResult'),
            getByUserIdV2: jest.fn().mockResolvedValue('getByUserIdV2Result'),
            changerUserPassword: jest.fn().mockResolvedValue('changerUserPasswordResult'),
            setTarget: jest.fn().mockResolvedValue('setTargetResult'),
          },
        },
        MyJwtGuard,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should call getByUserEmail with correct parameters and return the result', async () => {
    const emailUser = { email: 'test@test.com' };
    const result = await controller.getUserByEmail(emailUser);
    expect(service.getByUserEmail).toHaveBeenCalledWith(emailUser.email);
    expect(result).toBe('getByUserEmailResult');
  });

  it('should call searchByName with correct parameters and return the result', async () => {
    const req = { user: 'testUser' };
    const name = 'testName';
    const result = await controller.searchUsersByName(req, name);
    expect(service.searchByName).toHaveBeenCalledWith(req.user, name);
    expect(result).toBe('searchByNameResult');
  });

  it('should call getByUserIdV2 with correct parameters and return the result', async () => {
    const id = 'testId';
    const result = await controller.getById(id);
    expect(service.getByUserIdV2).toHaveBeenCalledWith(id);
    expect(result).toBe('getByUserIdV2Result');
  });

  it('should call changerUserPassword with correct parameters and return the result', async () => {
    const req = { user: { _id: 'testId' } };
    const user = { userId: 'testUserId', oldPassword: 'oldPassword', newPassword: 'newPassword' };
    const result = await controller.changeUserPassword(req, user);
    expect(service.changerUserPassword).toHaveBeenCalledWith(req.user._id, user.oldPassword, user.newPassword);
    expect(result).toBe('changerUserPasswordResult');
  });

  it('should call setTarget with correct parameters and return the result', async () => {
    const req = { user: { _id: 'testId' } };
    const target = { description: 'testDescription', startDate: new Date(), targetDate: new Date() };
    const result = await controller.setTarget(req, target);
    expect(service.setTarget).toHaveBeenCalledWith(req.user._id, target);
    expect(result).toBe('setTargetResult');
  });
});