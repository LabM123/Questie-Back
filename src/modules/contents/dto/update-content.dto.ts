import { IsOptional, IsString, IsUUID } from "class-validator"

export class UpdateContentDto {
    @IsOptional()
    @IsString()
    type: string
    
    @IsOptional()
    content: any
    
    @IsOptional()
    @IsString()
    @IsUUID()
    lesson_id: string
}
