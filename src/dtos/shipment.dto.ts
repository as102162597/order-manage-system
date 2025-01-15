import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OrderItemDto } from './order.item.dto';

export class ShipmentDto {
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsDate()
    shipmentDate: string;

    @IsNotEmpty()
    @IsString()
    shipmentAddress: string;

    @IsNumber()
    orderId: number;

    @IsArray()
    orderItems: OrderItemDto[];
};
