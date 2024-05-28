import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { User } from '../users/entities/user.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progress } from './entities/progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Progress, User, Lesson])],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
