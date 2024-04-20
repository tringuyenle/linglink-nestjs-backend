import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTagDTO } from './dto/createTag.dto';
import { UpdateTagDTO } from './dto/updateTag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  createTag(@Body() createTagDto: CreateTagDTO) {
    return this.tagsService.createTag(createTagDto);
  }

  @Get()
  getAllTags() {
    return this.tagsService.getAllTags();
  }

  @Get(':id')
  getTagById(@Param('id') id: string) {
    return this.tagsService.getTagById(id);
  }

  @Put(':id')
  updateTagById(@Param('id') id: string, @Body() updateTagDto: UpdateTagDTO) {
    return this.tagsService.updateTagById(id, updateTagDto);
  }

  @Delete(':id')
  removeTagById(@Param('id') id: string) {
    return this.tagsService.removeTagById(id);
  }
}
