import { IsNotEmpty, IsString, IsUUID } from "class-validator"

export class CreateContentDto {
    @IsNotEmpty()
    @IsString()
    type: string
    
    @IsNotEmpty()
    content: any
    
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    lesson_id: string
}
