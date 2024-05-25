import { Module } from '@nestjs/common';
import { Auth0Controller } from './auth0.controller';
import { Auth0Service } from './auth0.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [Auth0Controller],
  providers: [Auth0Service],
  exports: [],
})
export class Auth0Module {}
