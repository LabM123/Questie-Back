import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(10)
    name: string
}
