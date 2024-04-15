import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common'
import { CreateQuestionDTO } from './dto/createQuestion.dto'
import { UpdateQuestionDTO } from './dto/updateQuestion.dto'
import { QuestionsService } from './questions.service'
import { MyJwtGuard } from '../auth/guard/myjwt.guard'

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(MyJwtGuard)
  createQuestion(@Body() createQuestionDto: CreateQuestionDTO) {
    try {
      // Gọi service để tạo câu hỏi khi xác thực thành công
      return this.questionsService.createQuestion(createQuestionDto)
    } catch (error) {
      // Nếu có lỗi xác thực, trả về mã trạng thái 401
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }
  }

  @Get()
  getAllQuestions() {
    return this.questionsService.getAllQuestions()
  }

  @Get(':id')
  getQuestionById(@Param('id') id: string) {
    return this.questionsService.getQuestionById(id)
  }

  @Put(':id')
  updateQuestionById(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDTO) {
    return this.questionsService.updateQuestionById(id, updateQuestionDto)
  }

  @Delete(':id')
  removeQuestionById(@Param('id') id: string) {
    return this.questionsService.removeQuestionById(id)
  }
}
