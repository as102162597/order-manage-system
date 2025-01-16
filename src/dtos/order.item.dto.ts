import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Countable } from 'src/interfaces/countable';

export class OrderItemDto implements Countable {
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

    @IsNotEmpty()
    @IsString()
    tag: string

    @IsString()
    shipmentId: number;

    getPrice(): number {
        return Number(this.price) || 0;
    }
};
