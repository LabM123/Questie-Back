import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';

@Module({
  providers: [StatsService],
})
export class StatsModule {}
