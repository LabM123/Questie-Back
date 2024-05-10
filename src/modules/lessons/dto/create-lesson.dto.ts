import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  module_id: string;

  @ApiProperty({
    example: 1,
    description: "The order that the lesson will have within the module",
  })
  @IsNotEmpty()
  @IsNumber()
  order: number;

  @ApiProperty({
    example: 1,
    description: "The experience points that the lesson will give the user.",
  })
  @IsNotEmpty()
  @IsNumber()
  xp: number;
}
