import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateTopicDTO } from './dto/createTopic.dto';
import { UpdateTopicDTO } from './dto/updateTopic.dto';
import { TopicsService } from './topics.service';
import { MyJwtGuard } from 'src/auth/guard/myjwt.guard';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @UseGuards(MyJwtGuard)
  createTopic(@Body() createTopicDto: CreateTopicDTO) {
    try {
      // Gọi service để tạo câu hỏi khi xác thực thành công
      return this.topicsService.createTopic(createTopicDto);
    } catch (error) {
      // Nếu có lỗi xác thực, trả về mã trạng thái 401
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @Get()
  getAllTopics() {
    return this.topicsService.getAllTopics();
  }

  @Get(':id')
  getTopicById(@Param('id') id: string) {
    return this.topicsService.getTopicById(id);
  }

  @Put(':id')
  updateTopicById(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDTO,
  ) {
    return this.topicsService.updateTopicById(id, updateTopicDto);
  }

  @Delete(':id')
  removeTopicById(@Param('id') id: string) {
    return this.topicsService.removeTopicById(id);
  }
}
