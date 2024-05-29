import { Module } from '@nestjs/common';
import { Auth0Controller } from './auth0.controller';
import { Auth0Service } from './auth0.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Stats } from '../stats/entities/stats.entity';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Stats])],
  controllers: [Auth0Controller],
  providers: [Auth0Service, MailService],
  exports: [],
})
export class Auth0Module {}
