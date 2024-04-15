import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { MyJwtGuard } from 'src/auth/guard/myjwt.guard';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @UseGuards(MyJwtGuard)
  @Post('')
  async createEvent(
    @Req() req: any,
    @Body() event: { title: string; start: Date; end: Date; descrip: string },
  ) {
    return this.calendarService.createEvent(req.user, event);
  }

  @UseGuards(MyJwtGuard)
  @Put('/:eventId')
  async updateEvent(
    @Req() req: any,
    @Param('eventId') eventId: string,
    @Body() event: { title?: string; start?: Date; end?: Date },
  ) {
    return this.calendarService.updateEvent(req.user, eventId, event);
  }

  @UseGuards(MyJwtGuard)
  @Delete('/:eventId')
  async deleteEvent(@Req() req: any, @Param('eventId') eventId: string) {
    return this.calendarService.deleteEvent(req.user, eventId);
  }

  @UseGuards(MyJwtGuard)
  @Get('')
  async getEvents(@Req() req: any) {
    return this.calendarService.getEvents(req.user);
  }
}
