import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateModuleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  course_id: string;

  @ApiProperty({
    example: 1,
    description: "The experience points that the lesson will give the user.",
  })
  @IsOptional()
  @IsString()
  lessons_id: string;
}
