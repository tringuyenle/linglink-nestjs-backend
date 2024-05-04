import {
  Controller,
  UseGuards,
  Req,
  Query,
  Get,
  Put,
  Body,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { UpdateQuestionIntoProgressDto } from './dto/update-question-into-progress.dto';

@Controller('progresses')
export class ProgressController {
  constructor(
    private readonly progressService: ProgressService,
  ) {}

  @UseGuards(MyJwtGuard)
  @Get()
  async getProgressByUserId(
    @Query('userId') userId: string,
    @Query('date') date?: Date,
  ) {
    return this.progressService.getProgressByUserId(userId, date);
  }

  @UseGuards(MyJwtGuard)
  @Put()
  async updateQuestionInProgress(
    @Req() req,
    @Body() updateQuestionIntoProgressDto: UpdateQuestionIntoProgressDto,
  ) {
    return this.progressService
    .updateQuestionInProgress(
      req.user, updateQuestionIntoProgressDto.questionId, 
      updateQuestionIntoProgressDto.isCorrect
    );
  }
}
