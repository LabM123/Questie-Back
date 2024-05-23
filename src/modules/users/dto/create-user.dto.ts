import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  MinLength,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @MaxLength(20)
  @IsNotEmpty()
  passwordConfirmation: string;

  @IsEmail()
  @MaxLength(50)
  @IsNotEmpty()
  email: string;

  @IsDateString()
  @IsOptional()
  birthdate: string;

  @IsString()
  @IsOptional()
  profile_pic?: string;
}
