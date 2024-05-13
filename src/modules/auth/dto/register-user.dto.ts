import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    example: 'JohnDoe',
    description: 'The username you want to use on the platform',
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters' })
  username: string;

  @ApiProperty({
    example: '!JohnDoe@1234',
    description: 'The password, make sure it is strong.',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(15, { message: 'Password must not exceed 15 characters' })
  password: string;

  @ApiProperty({
    example: '!JohnDoe@1234',
    description: 'Confirm password, must match the password field.',
  })
  @IsNotEmpty({ message: 'Confirm Password is required' })
  @IsString({ message: 'Confirm Password must be a string' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @MinLength(8, {
    message: 'Confirm Password must be at least 8 characters long',
  })
  @MaxLength(15, { message: 'Confirm Password must not exceed 15 characters' })
  confirmPassword: string;

  @ApiProperty({
    example: 'johnDoe@gmail.com',
    description: 'The email to associate with the account.',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    example: 'https://example.com/profile_pic.jpg',
    description: "URL of the user's profile picture.",
  })
  @IsOptional()
  @IsString({ message: 'Profile picture must be a string' })
  profile_pic?: string;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user.',
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @MinLength(3, { message: 'First name must be at least 5 characters long' })
  @MaxLength(15, { message: 'First name must not exceed 15 characters' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user.',
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(3, { message: 'Last name must be at least 5 characters long' })
  @MaxLength(15, { message: 'Last name must not exceed 15 characters' })
  lastName: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'The birthdate of the user.',
  })
  @IsNotEmpty({ message: 'Birthdate is required' })
  @IsString({ message: 'Birthdate must be a string' })
  @IsDateString()
  birthdate: string;
}
