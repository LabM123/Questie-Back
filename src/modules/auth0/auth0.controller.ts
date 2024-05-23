import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { Auth0Service } from './auth0.service';
import { Auth0Guard } from './guards/auth0.guard';

@Controller('auth0')
export class Auth0Controller {
  constructor(private readonly auth0Service: Auth0Service) {}

  @UseGuards(Auth0Guard)
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.auth0Service.createAuth0User(createUserDto);
  }
}
