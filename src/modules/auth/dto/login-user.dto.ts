import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    example: "JohnDoe",
    description: "The username you create for the platform",
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: "!JohnDoe@1234",
  })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!?@#$%^&*])/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
  })
  @MinLength(8)
  @MaxLength(15)
  password: string;
}
