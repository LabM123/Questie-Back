import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class BuyCourseDto {
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    courseId: string
    
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    userId: string
    
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    productId: string
}