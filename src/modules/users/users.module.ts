import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Stats } from '../stats/entities/stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Stats])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
