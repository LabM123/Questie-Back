import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({
    example: "Programacion",
    description: "The category that the course will have",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(10)
  name: string;
}
