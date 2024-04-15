import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common'
import { MyJwtGuard } from '../auth/guard/myjwt.guard'
import { ReactionCommentDTO, ReactionPostDTO } from './dto/reaction.dto'
import { ReactionsService } from './reactions.service'

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post('/likepost')
  @UseGuards(MyJwtGuard)
  likePost(@Req() req, @Body() react: ReactionPostDTO) {
    return this.reactionsService.likePost(req.user, react.postId)
  }

  @Post('/dislikepost')
  @UseGuards(MyJwtGuard)
  dislikePost(@Req() req, @Body() react: ReactionPostDTO) {
    return this.reactionsService.dislikePost(req.user, react.postId)
  }

  @Post('/likecomment')
  @UseGuards(MyJwtGuard)
  likeComment(@Req() req, @Body() react: ReactionCommentDTO) {
    return this.reactionsService.likeComment(req.user, react.commentId)
  }

  @Post('/dislikecomment')
  @UseGuards(MyJwtGuard)
  dislikeComment(@Req() req, @Body() react: ReactionCommentDTO) {
    return this.reactionsService.dislikeComment(req.user, react.commentId)
  }

  @Get('/post/:id')
  getReactionByPostId(@Param('id') post_id: string) {
    return this.reactionsService.getReactionByPostId(post_id)
  }

  @Get('/comment/:id')
  getReactionByCommentId(@Param('id') comment_id: string) {
    return this.reactionsService.getReactionByCommentId(comment_id)
  }

  // @Delete(':id')
  // deleteReactionByPostId(@Param('id') post_id: string) {
  //     return this.reactionsService.removeReactionByPostId(post_id);
  // }
}
