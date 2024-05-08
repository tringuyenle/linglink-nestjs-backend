import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { CreateTagDTO } from './dto/createTag.dto';
import { UpdateTagDTO } from './dto/updateTag.dto';
import { Tag } from 'schemas/tag.schema';
import { Types } from 'mongoose';

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: {
            createTag: jest.fn(),
            getAllTags: jest.fn(),
            getTagById: jest.fn(),
            updateTagById: jest.fn(),
            removeTagById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a tag', async () => {
    const dto: CreateTagDTO = {
      tagName: 'someTagName',
      questionsList: [], // assuming questionsList is an array, adjust as needed
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result: Tag = {
      tagName: dto.tagName,
      questionsList: dto.questionsList,
    };
    jest.spyOn(service, 'createTag').mockResolvedValue(result);
    expect(await controller.createTag(dto)).toBe(result);
  });

  it('should get all tags', async () => {
    const result = [/* expected result */];
    jest.spyOn(service, 'getAllTags').mockResolvedValue(result);
    expect(await controller.getAllTags()).toBe(result);
  });

  it('should get a tag by id', async () => {
    const id = 'valid_id';
    const result: Tag = {
      tagName: 'someTagName',
      questionsList: [],
    };
    jest.spyOn(service, 'getTagById').mockResolvedValue(result);
    expect(await controller.getTagById(id)).toBe(result);
  });

  it('should update a tag by id', async () => {
    const id = 'valid_id';
    const dto: CreateTagDTO = {
      tagName: 'someTagName',
      questionsList: [], // assuming questionsList is an array, adjust as needed
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result: Tag = {
      tagName: dto.tagName,
      questionsList: dto.questionsList,
    };
    jest.spyOn(service, 'updateTagById').mockResolvedValue(result);
    expect(await controller.updateTagById(id, dto)).toBe(result);
  });

  it('should remove a tag by id', async () => {
    const id = 'valid_id';
    const result: Tag = {
      tagName: 'someTagName',
      questionsList: [],
    };
    jest.spyOn(service, 'removeTagById').mockResolvedValue(result);
    expect(await controller.removeTagById(id)).toBe(result);
  });
});