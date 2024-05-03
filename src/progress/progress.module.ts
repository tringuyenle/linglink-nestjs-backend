import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { 
  Progress, 
  ProgressSchema 
} from 'schemas/progress.schema';
import { UserService } from 'src/user/user.service';
import { UserSchema } from 'schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Progress.name, schema: ProgressSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService, UserService],
})
export class ProgressModule {}
