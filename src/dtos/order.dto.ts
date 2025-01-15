import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ShipmentDto } from './shipment.dto';

export class OrderDto {
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    salesChannel: string;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsString()
    customerName: string;

    @IsString()
    shippingAddress: string;

    @IsString()
    deliveryMethod: string;

    @IsString()
    paymentMethod: string;

    @IsString()
    status: string;

    @IsDate()
    placementDate: Date;

    @IsDate()
    deliveryDate: Date;

    @IsArray()
    shipments: ShipmentDto[];
};
