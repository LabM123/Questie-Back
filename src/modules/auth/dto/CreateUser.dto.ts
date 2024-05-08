import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*])/, {message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.'})
    @MinLength(8)
    @MaxLength(15)
    password: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    profile_pic?: string
}