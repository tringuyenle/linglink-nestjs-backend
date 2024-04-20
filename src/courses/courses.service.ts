import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseProps } from 'schemas/course.schema';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    startDate?: Date,
    courseTypes?: string[],
    sortField?: string,
    sortOrder?: 'asc' | 'desc',
  ) {
    const skip = (page - 1) * limit;
    let query = this.courseModel.find();
    let countQuery = this.courseModel.find();
    if (name) {
      const nameRegex = new RegExp(name, 'i');
      query = query.where('name').regex(nameRegex);
      countQuery = countQuery.where('name').regex(nameRegex);
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
      query = query.where('price').gte(minPrice).lte(maxPrice);
      countQuery = countQuery.where('price').gte(minPrice).lte(maxPrice);
    }
    if (startDate) {
      const newStartDate = new Date(startDate);
      query = query.where('startTime').gte(newStartDate.getTime());
      countQuery = countQuery.where('startTime').gte(newStartDate.getTime());
    }
    if (courseTypes && courseTypes.length > 0) {
      query = query.where('type').in(courseTypes);
      countQuery = countQuery.where('type').in(courseTypes);
    }

    if (sortField && sortOrder) {
      const sortCriteria = {};
      sortCriteria[sortField] = sortOrder === 'asc' ? 1 : -1;
      query = query.sort(sortCriteria);
    }

    const totalCourses = await countQuery.countDocuments();
    const totalPages = Math.ceil(totalCourses / limit);

    const courses = await query.skip(skip).limit(limit).exec();

    return {
      courses,
      pageSize: limit,
      totalPage: totalPages,
    };
  }

  async findById(id: string): Promise<Course | null> {
    return this.courseModel.findById(id).exec();
  }

  async create(courseProps: CourseProps): Promise<Course> {
    const createdCourse = new this.courseModel(courseProps);
    console.log(courseProps);
    return createdCourse.save();
  }

  async update(id: string, courseProps: CourseProps): Promise<Course | null> {
    return this.courseModel
      .findByIdAndUpdate(id, courseProps, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Course | null> {
    return this.courseModel.findByIdAndDelete(id).exec();
  }
}
