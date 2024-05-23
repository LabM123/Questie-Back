import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { StatsController } from './stats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
