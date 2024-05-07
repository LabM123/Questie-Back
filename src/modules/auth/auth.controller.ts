import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/LoginUser.dto';
import { CreateUserDto } from './dto/CreateUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('signup')
  registerUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.registerUser(createAuthDto);
  }
}
