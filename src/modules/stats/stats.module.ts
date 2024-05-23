import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { StatsController } from './stats.controller';
import { Stats } from './entities/stats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Stats]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
