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

    getQuantity(): number {
        return Number(this.quantity) || 0;
    }

    getPrice(): number {
        return Number(this.price) || 0;
    }

    calculateTotalPrice(): number {
        return this.getPrice() * this.getQuantity();
    }
};
