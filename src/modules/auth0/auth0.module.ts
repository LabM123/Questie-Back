import { Module } from '@nestjs/common';
import { Auth0Service } from './auth0.service';
import { Auth0Controller } from './auth0.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'mercadopago';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [Auth0Controller],
  providers: [Auth0Service],
})
export class Auth0Module {}
