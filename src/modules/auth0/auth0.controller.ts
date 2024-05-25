import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { Auth0Service } from './auth0.service';

@Controller('auth0')
export class Auth0Controller {
  constructor(private readonly auth0Service: Auth0Service) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.auth0Service.createAuth0User(createUserDto);
  }
}
