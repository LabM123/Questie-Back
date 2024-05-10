import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    example: "JohnDoe",
    description: "The username you want to use on the platform",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    example: "!JohnDoe@1234",
    description: "The password, make sure it is strong.",
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.',
  })
  @MinLength(8)
  @MaxLength(15)
  password: string;

  @ApiProperty({
    example: "johnDoe@gmail.com",
    description: "The email to associate with the account.",
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  profile_pic?: string;
}
