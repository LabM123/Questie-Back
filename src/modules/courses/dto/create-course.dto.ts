import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import Module from "module"
import { Category } from "src/modules/categories/entities/category.entity"

export class CreateCourseDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(5)
    title: string

    @IsOptional()
    categories: Category[]
    
    @IsOptional()
    modules: Module[]
}
