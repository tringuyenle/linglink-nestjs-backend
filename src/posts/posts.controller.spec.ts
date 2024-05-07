import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDTO } from './dto/createPost.dto';
import { UpdatePostDTO } from './dto/updatePost.dto';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { CreateQuestionDTO } from '../questions/dto/createQuestion.dto';
import { Question } from '../../schemas/question.schema';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            createPost: jest.fn().mockResolvedValue('createPostResult'),
            getAllPosts: jest.fn().mockResolvedValue('getAllPostsResult'),
            getPostWithReactById: jest.fn().mockResolvedValue('getPostWithReactByIdResult'),
            getPostByTopic: jest.fn().mockResolvedValue('getPostByTopicResult'),
            updatePostById: jest.fn().mockResolvedValue('updatePostByIdResult'),
            removePostById: jest.fn().mockResolvedValue('removePostByIdResult'),
            getAllPostsByPage: jest.fn().mockResolvedValue('getAllPostsByPageResult'),
            getAllPostsByPagev2: jest.fn().mockResolvedValue('getAllPostsByPagev2Result'),
          },
        },
        MyJwtGuard,
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should call createPost with correct parameters and return the result', async () => {
    const req = { user: 'testUser' };
    const createPostDto: CreatePostDTO = {
        content: 'Test Content',
        topicID: '',
        question: '',
        newQuestion: new CreateQuestionDTO(),
        imgs_url: [],
        audio_url: ''
    };
    const result = await controller.createPost(req, createPostDto);
    expect(service.createPost).toHaveBeenCalledWith(req.user, createPostDto);
    expect(result).toBe('createPostResult');
  });

  it('should call getAllPosts and return the result', async () => {
    const result = await controller.getAllPosts();
    expect(service.getAllPosts).toHaveBeenCalled();
    expect(result).toBe('getAllPostsResult');
  });

  it('should call getPostById with correct parameters and return the result', async () => {
    const req = { user: { _id: 'testId' } };
    const postId = 'testPostId';
    const result = await controller.getPostById(req, postId);
    expect(service.getPostWithReactById).toHaveBeenCalledWith(req.user._id.toString(), postId);
    expect(result).toBe('getPostWithReactByIdResult');
  });

  it('should call getPostByTopic with correct parameters and return the result', async () => {
    const id = 'testId';
    const result = await controller.getPostByTopic(id);
    expect(service.getPostByTopic).toHaveBeenCalledWith(id);
    expect(result).toBe('getPostByTopicResult');
  });

  it('should call updatePostById with correct parameters and return the result', async () => {
    const req = { user: 'testUser' };
    const id = 'testId';
    const updatePostDto: UpdatePostDTO = {
        content: 'Updated Content',
        topic: '',
        question: new Question,
        imgs_url: ''
    };
    const result = await controller.updatePostById(req, id, updatePostDto);
    expect(service.updatePostById).toHaveBeenCalledWith(req.user, id, updatePostDto);
    expect(result).toBe('updatePostByIdResult');
  });

  it('should call removePostById with correct parameters and return the result', async () => {
    const req = { user: 'testUser' };
    const id = 'testId';
    const result = await controller.removePostById(req, id);
    expect(service.removePostById).toHaveBeenCalledWith(req.user, id);
    expect(result).toBe('removePostByIdResult');
  });

  it('should call getAllPostsByPage with correct parameters and return the result', async () => {
    const lastPostId = 'testLastPostId';
    const pageSize = 10;
    const result = await controller.getAllPostsByPage(lastPostId, pageSize);
    expect(service.getAllPostsByPage).toHaveBeenCalledWith(lastPostId, pageSize);
    expect(result).toBe('getAllPostsByPageResult');
  });

  it('should call getAllPostsByPagev2 with correct parameters and return the result', async () => {
    const req = { user: { _id: 'testId' } };
    const lastPostId = 'testLastPostId';
    const pageSize = 10;
    const topic = 'testTopic';
    const author = 'testAuthor';
    const result = await controller.getAllPostsByPagev2(req, lastPostId, pageSize, topic, author);
    expect(service.getAllPostsByPagev2).toHaveBeenCalledWith(lastPostId, req.user._id.toString(), pageSize, topic, author);
    expect(result).toBe('getAllPostsByPagev2Result');
  });
});