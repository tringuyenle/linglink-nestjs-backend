import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CourseService } from './courses.service';
import { Course, CourseProps } from 'schemas/course.schema';

interface CoursePaginationResult {
  courses: Course[];
  pageSize: number;
  totalPage: number;
}

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('startDate') startDate?: Date,
    @Query('courseTypes') courseTypes?: string[],
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<CoursePaginationResult> {
    return this.courseService.findAll(
      page,
      limit,
      name,
      minPrice,
      maxPrice,
      startDate,
      courseTypes,
      sortField,
      sortOrder,
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Course | null> {
    return this.courseService.findById(id);
  }

  @Post()
  async create(@Body() courseProps: CourseProps): Promise<Course> {
    return this.courseService.create(courseProps);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() courseProps: CourseProps,
  ): Promise<Course | null> {
    return this.courseService.update(id, courseProps);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Course | null> {
    return this.courseService.delete(id);
  }
}
