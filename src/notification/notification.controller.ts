import {
  Controller,
  UseGuards,
  Req,
  Query,
  Get,
  Body,
  Post,
} from '@nestjs/common';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(MyJwtGuard)
  @Get()
  async get(
    @Req() req,
    @Query('lastNoti') lastNoti?: string,
  ) {
    return this.notificationService.getNotificationByUserId(req.user, lastNoti);
  }

  @UseGuards(MyJwtGuard)
  @Post()
  async create(
    @Req() req,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationService.create(
      req.user,
      createNotificationDto
    );
  }
}
