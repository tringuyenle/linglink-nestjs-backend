import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Course extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  student: number;

  @Prop({ required: true })
  teacher: string;

  @Prop()
  teacher_genders?: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true })
  img: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  downprice?: number;

  @Prop()
  downrate?: number;

  @Prop()
  type?: string[];

  @Prop()
  descrip?: string;

  @Prop()
  target?: string;

  @Prop()
  information?: string;

  @Prop()
  contact?: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

export type CourseProps = {
    name: string;
    student: number;
    teacher: string;
    teacher_genders?: string;
    startTime: Date;
    endTime: Date;
    img: string;
    price: number;
    downprice?: number;
    downrate?: number;
    type?: string[];
    descrip?: string;
    target?: string;
    information?: string;
    contact?: string;
  };
  