import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TagSchema } from '../../schemas/tag.schema'
import { TagsService } from './tags.service'
import { TagsController } from './tags.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Tag', schema: TagSchema }])],
  providers: [TagsService],
  controllers: [TagsController]
})
export class TagsModule {}
