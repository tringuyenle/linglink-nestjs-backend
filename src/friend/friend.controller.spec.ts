import { Test, TestingModule } from '@nestjs/testing';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { UserService } from '../user/user.service';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { User } from '../../schemas/user.schema';
import { Types } from 'mongoose';
import { UserRoles } from '../common/enums/user.enum';
import { Friend } from '../../schemas/friend.schema';

describe('FriendController', () => {
  let friendController: FriendController;
  let friendService: FriendService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendController],
      providers: [
        { provide: FriendService, useValue: { addFriend: jest.fn(), getListFriends: jest.fn() } },
        { provide: UserService, useValue: { getByUserId: jest.fn() } },
      ],
    })
    .overrideGuard(MyJwtGuard)
    .useValue({ canActivate: jest.fn().mockReturnValue(true) })
    .compile();

    friendController = module.get<FriendController>(FriendController);
    friendService = module.get<FriendService>(FriendService);
    userService = module.get<UserService>(UserService);
  });

  it('should add a friend', async () => {
    const friend: User = {
      email: 'user1@example.com',
      hashedPassword: 'hashedPassword',
      _id: new Types.ObjectId(),
      name: '',
      role: UserRoles.STUDENT,
      avatar: '',
      target: null,
      description: '',
      phoneNumber: ''
    };
    const user: User = {
      email: 'user2@example.com',
      hashedPassword: 'hashedPassword',
      _id: new Types.ObjectId(),
      name: '',
      role: UserRoles.STUDENT,
      avatar: '',
      target: null,
      description: '',
      phoneNumber: ''
    };
    const newFriend: any = ({
      user: user._id.toString(),
      friends: [friend._id],
    });
    const req = { user: user };

    jest.spyOn(userService, 'getByUserId').mockResolvedValue(friend);
    jest.spyOn(friendService, 'addFriend').mockResolvedValue(newFriend);

    expect(await friendController.addFriend(req, {friendId: friend._id.toString()})).toBe(newFriend);
  });

  it('should get a list of friends', async () => {
    const userId = 'user1';
    const friends: User[] = [
      { 
        _id: new Types.ObjectId(),
        email: 'user2@example.com',
        hashedPassword: 'hashedPassword',
        name: 'User 2',
        role: UserRoles.STUDENT,
        avatar: '',
        target: null,
        description: '',
        phoneNumber: ''
      },
      { 
        _id: new Types.ObjectId(),
        email: 'user3@example.com',
        hashedPassword: 'hashedPassword',
        name: 'User 3',
        role: UserRoles.STUDENT,
        avatar: '',
        target: null,
        description: '',
        phoneNumber: ''
      }
    ];

    jest.spyOn(friendService, 'getListFriends').mockResolvedValue(friends);

    expect(await friendController.getEvents(userId)).toBe(friends);
    expect(friendService.getListFriends).toHaveBeenCalledWith(userId);
  });
});