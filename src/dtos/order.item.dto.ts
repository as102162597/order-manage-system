import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderItemDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsString()
    shipmentId: number;
};
