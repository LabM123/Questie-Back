import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [StatsService],
})
export class StatsModule {}
