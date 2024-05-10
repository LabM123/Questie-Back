import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import Module from "module";
import { Category } from "src/modules/categories/entities/category.entity";

export class CreateCourseDto {
  @ApiProperty({
    example: "Introduccion a la programacion con python",
    description: "The title of the course that is being created",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(5)
  title: string;

  @ApiProperty({
    example: "Development",
    description: "The category or tag of the course that is being created",
  })
  @IsOptional()
  categories: Category[];

  @ApiProperty({
    example: "Variables",
    description: "The course or courses that are going to be associated",
  })
  @IsOptional()
  modules: Module[];
}
