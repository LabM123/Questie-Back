import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateCategoryDto {
    @ApiProperty({
        example: "Programacion",
        description: "Use to change the category name",
      })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    @MinLength(10)
    name: string

}
