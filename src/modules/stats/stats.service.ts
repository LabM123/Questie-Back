import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Stats } from './entities/stats.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
  ) {}

  async addCoins(userId: string, { coins }: { coins: number }) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['stats'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (Number(user.stats.coins) + Number(coins) < 0)
      throw new BadRequestException('Insufficient coins');

    user.stats.coins = Number(user.stats.coins) + Number(coins);

    await this.statsRepository.save(user.stats);

    return user.stats;
  }

  async addXp(userId: string, { xp }: { xp: number }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.stats.xp += xp;
    await this.userRepository.save(user);
  }
}
