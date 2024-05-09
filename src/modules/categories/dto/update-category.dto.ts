import { IsArray, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    @MaxLength(50)
    @MinLength(10)
    name: string

    @IsArray()
    @IsOptional()
    courses_id: string[]
}
