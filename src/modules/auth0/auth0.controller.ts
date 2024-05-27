import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { Auth0Service } from './auth0.service';

@ApiTags('Auth0')
@Controller('auth0')
export class Auth0Controller {
  constructor(private readonly auth0Service: Auth0Service) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario en Auth0' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'El usuario ha sido registrado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.auth0Service.createAuth0User(createUserDto);
  }
}
