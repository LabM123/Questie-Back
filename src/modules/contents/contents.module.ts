import { Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Content } from './entities/content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Content])],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}
