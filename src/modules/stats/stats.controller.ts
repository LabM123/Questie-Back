import {
  Controller,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { RolesGuard } from '../auth/guard/roles.guard';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
export class UsersController {
  constructor(private readonly statsService: StatsService) {}

  @Post('coins/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth()
  async addCoins(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: { coins: number },
  ) {
    return await this.statsService.addCoins(userId, body);
  }

  @Post('xp/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth()
  async addXp(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: { xp: number },
  ) {
    return await this.statsService.addXp(userId, body);
  }
}
