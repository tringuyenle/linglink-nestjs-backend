import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './courses.controller';
import { CourseService } from './courses.service';
import { CourseProps } from '../../schemas/course.schema';

describe('CourseController', () => {
  let courseController: CourseController;
  let courseService: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        { provide: CourseService, useValue: { findAll: jest.fn(), findById: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() } },
      ],
    }).compile();

    courseController = module.get<CourseController>(CourseController);
    courseService = module.get<CourseService>(CourseService);
  });

  it('should find all courses', async () => {
    const result: any = {
      // Fill with appropriate data
    };
    jest.spyOn(courseService, 'findAll').mockResolvedValue(result);
    expect(await courseController.findAll()).toBe(result);
  });

  it('should find course by id', async () => {
    const result: any = {
      name: '',
      student: 0,
      teacher: '',
      startTime: undefined,
      endTime: undefined,
      img: '',
      price: 0,
    };
    jest.spyOn(courseService, 'findById').mockResolvedValue(result);
    expect(await courseController.findById('1')).toBe(result);
  });

  it('should create a course', async () => {
    const courseProps: CourseProps = {
      name: '',
      student: 0,
      teacher: '',
      startTime: undefined,
      endTime: undefined,
      img: '',
      price: 0
    };
    const result: any = {
      name: '',
      student: 0,
      teacher: '',
      startTime: undefined,
      endTime: undefined,
      img: '',
      price: 0,
    };
    jest.spyOn(courseService, 'create').mockResolvedValue(result);
    expect(await courseController.create(courseProps)).toBe(result);
  });

  it('should update a course', async () => {
    const courseProps: CourseProps = {
      name: '',
      student: 0,
      teacher: '',
      startTime: undefined,
      endTime: undefined,
      img: '',
      price: 0
    };
    const result: any = {
      name: '',
      student: 0,
      teacher: '',
      startTime: undefined,
      endTime: undefined,
      img: '',
      price: 0,
    };
    jest.spyOn(courseService, 'update').mockResolvedValue(result);
    expect(await courseController.update('1', courseProps)).toBe(result);
  });

  it('should delete a course', async () => {
    const result: any = {
      name: '',
      student: 0,
      teacher: '',
      startTime: undefined,
      endTime: undefined,
      img: '',
      price: 0,
    };
    jest.spyOn(courseService, 'delete').mockResolvedValue(result);
    expect(await courseController.delete('1')).toBe(result);
  });
});