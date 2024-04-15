import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import {
  Calendar,
  CalendarSchema,
  Event,
  EventSchema,
} from 'schemas/calendar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Calendar.name, schema: CalendarSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
