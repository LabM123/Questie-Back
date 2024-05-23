import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Auth0Controller } from './auth0.controller';
import { Auth0Service } from './auth0.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'meudeuscara', // No se utilizará, solo está aquí por compatibilidad
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [Auth0Controller],
  providers: [JwtStrategy, Auth0Service],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
