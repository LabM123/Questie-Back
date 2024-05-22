import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersInterceptor } from '../users/users.interceptor';
@ApiTags('Auth')
@UseInterceptors(UsersInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Sign in user',
    description: 'Allows a user to sign in by providing their credentials.',
  })
  @Post('signin')
  @HttpCode(200)
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @ApiOperation({
    summary: 'Sign up user',
    description:
      'Allows a user to sign up by providing their registration details.',
  })
  @Post('signup')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }
}
