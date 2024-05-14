import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { CreateCommentDTO } from './dto/createComment.dto';
import { Types } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { UserRoles } from '../common/enums/user.enum';
import { UpdateCommentDTO } from './dto/updateComment.dto';
import { HttpStatus } from '@nestjs/common';
import { Comment } from '../../schemas/comment.schema';


jest.mock('./comments.service');

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: jest.Mocked<CommentsService>;
  let req;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        CommentsService,
        MyJwtGuard,
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get(CommentsService);
    req = {
      user: {
        _id: 'testUserId',
      },
    };
  });

  const author: User = {
    email: 'test@example.com',
    hashedPassword: 'hashedPassword',
    name: 'Test User',
    _id: new Types.ObjectId(),
    role: UserRoles.ADMIN,
    avatar: '',
    target: null,
    description: '',
    phoneNumber: ''
  };

  const dto: CreateCommentDTO = {
    content: '',
    author,
    post: null, // Create a new instance of the Post class
    comment: undefined,
    createdAt: undefined,
    updatedAt: undefined
  };
  
  const result : any = {
    data: '',
    length: 0,
    ownerDocument: undefined,
  };

  it('should create a comment', async () => {
    service.createComment.mockResolvedValue(result);

    expect(await controller.createComment(req, dto)).toBe(result);
    expect(service.createComment).toHaveBeenCalledWith(req.user, dto);
  });

  it('should get comments by post id', async () => {
    const postId = 'testPostId';
    const result : any = [{
      data: Comment,
      like: true,
      dislike: false,
      numlikes: 1,
      numdislikes: 0,
    }];
    service.getCommentsWithReactByPostId.mockResolvedValue(result);

    expect(await controller.getCommentByPostId(req, postId)).toBe(result);
    expect(service.getCommentsWithReactByPostId).toHaveBeenCalledWith(postId, req.user._id.toString());
  });

  it('should get comments by comment id', async () => {
    const commentId = '507f1f77bcf86cd799439011';
    const result : any = [{
      data: Comment,
      like: true,
      dislike: false,
      numlikes: 1,
      numdislikes: 0,
    }];
    service.getCommentsWithReactByCommentId.mockResolvedValue(result);

    expect(await controller.getCommentByCommentId(req, commentId)).toBe(result);
    expect(service.getCommentsWithReactByCommentId).toHaveBeenCalledWith(commentId, req.user._id.toString());
  });

  it('should update a comment', async () => {
    const commentId = '507f1f77bcf86cd799439011';
    const dto: UpdateCommentDTO = {
      content: 'Updated comment content',
      createdAt: undefined,
      updatedAt: undefined
    };
    const result: Comment = { 
      _id: new Types.ObjectId(commentId),
      author: {
        email: req.user.email,
        _id: new Types.ObjectId(),
        hashedPassword: '',
        name: '',
        role: UserRoles.ADMIN,
        avatar: '',
        target: null,
        description: '',
        phoneNumber: ''
      },
      content: dto.content,
      numComments: 0,
      post: null,
      comment: null
    };
    service.updateCommentsById.mockResolvedValue(result);
  
    expect(await controller.updateCommentById(req, commentId, dto)).toBe(result);
    expect(service.updateCommentsById).toHaveBeenCalledWith(req.user, commentId, dto);
  });

  it('should remove a comment', async () => {
    const commentId = '507f1f77bcf86cd799439011';
    const result = HttpStatus.OK;
    service.removeCommentById.mockResolvedValue(result);

    expect(await controller.removeCommentById(req, commentId)).toBe(result);
    expect(service.removeCommentById).toHaveBeenCalledWith(req.user, commentId);
  });

  it('should remove comments by post id', async () => {
    const postId = 'testPostId';
    const result = HttpStatus.OK;
    service.removeCommentsByPostId.mockResolvedValue(result);

    expect(await controller.removeCommentsByPostId(req, postId)).toBe(result);
    expect(service.removeCommentsByPostId).toHaveBeenCalledWith(req.user, postId);
  });
});