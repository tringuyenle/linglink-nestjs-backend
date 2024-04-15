import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDTO } from './dto/createComment.dto';
import { UpdateCommentDTO } from './dto/updateComment.dto';
import { CommentsService } from './comments.service';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(MyJwtGuard)
  createComment(@Req() req, @Body() createCommentDto: CreateCommentDTO) {
    return this.commentsService.createComment(req.user, createCommentDto);
  }

  @Get('post')
  @UseGuards(MyJwtGuard)
  getCommentByPostId(@Req() req, @Query('postId') postId: string) {
    const userId = req.user._id.toString();
    return this.commentsService.getCommentsWithReactByPostId(postId, userId);
  }

  @Get(':id')
  @UseGuards(MyJwtGuard)
  getCommentByCommentId(@Req() req, @Query('commentId') commentId: string) {
    const userId = req.user._id.toString();
    return this.commentsService.getCommentsWithReactByCommentId(
      commentId,
      userId,
    );
  }

  // @Get(':id')
  // getCommentByUserId(@Param('id') userId: string) {
  //     // return this.tagsService.getTagById(userId);
  // }

  @Put(':id')
  @UseGuards(MyJwtGuard)
  updateCommentById(
    @Req() req,
    @Param('id') commentId: string,
    @Body() updateCommentDto: UpdateCommentDTO,
  ) {
    return this.commentsService.updateCommentsById(
      req.user,
      commentId,
      updateCommentDto,
    );
  }

  @Delete(':id')
  @UseGuards(MyJwtGuard)
  removeCommentById(@Req() req, @Param('id') commentId: string) {
    return this.commentsService.removeCommentById(req.user, commentId);
  }

  @Delete('post/:id')
  @UseGuards(MyJwtGuard)
  removeCommentsByPostId(@Req() req, @Param('id') postId: string) {
    return this.commentsService.removeCommentsByPostId(req.user, postId);
  }
}
