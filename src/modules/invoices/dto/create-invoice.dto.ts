import { IsNotEmpty, IsString } from "class-validator"

export class CreateInvoiceDto {
    @IsNotEmpty()
    @IsString()
    user_id: string
    
    @IsNotEmpty()
    @IsString()
    product_id: string
}
