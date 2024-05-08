import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { 
  Progress, 
  ProgressSchema 
} from '../../schemas/progress.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'User', schema: UserSchema },
    { name: Progress.name, schema: ProgressSchema },
  ])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
