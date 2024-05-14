import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { NewRequestDto } from './dto/newRequest.dto';
import { RequestAddFriendService } from './request-add-friend.service';
import { RequestDto } from './dto/request.dto';

@Controller('request-add-friend')
export class RequestAddFriendController {
  constructor(
    private readonly requestAddFriendService: RequestAddFriendService,
  ) {}

  @Post()
  @UseGuards(MyJwtGuard)
  createRequest(@Req() req, @Body() newRequestDto: NewRequestDto) {
    return this.requestAddFriendService.createRequest(req.user, newRequestDto);
  }

  @Post('accept')
  @UseGuards(MyJwtGuard)
  acceptRequest(@Req() req, @Body() requestDto: RequestDto) {
    return this.requestAddFriendService.acceptRequest(req.user, requestDto);
  }

  @Post('deny')
  @UseGuards(MyJwtGuard)
  denyRequest(@Req() req, @Body() requestDto: RequestDto) {
    return this.requestAddFriendService.denyRequest(req.user, requestDto);
  }

  @Get()
  @UseGuards(MyJwtGuard)
  getRequestList(@Req() req) {
    return this.requestAddFriendService.getRequestList(req.user);
  }

  @Get('add')
  @UseGuards(MyJwtGuard)
  getMyRequestList(@Req() req) {
    return this.requestAddFriendService.getMyRequestList(req.user);
  }

  @Delete(':id')
  @UseGuards(MyJwtGuard)
  DeleteRequest(
    @Req() req,
    @Param('id')
    id: string,
  ) {
    return this.requestAddFriendService.deleteRequest(req.user, id);
  }
}
