import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OrderItemDto } from './order.item.dto';
import { Iterable, Iterator } from 'src/interfaces/iterator';
import { Countable } from 'src/interfaces/countable';

export class ShipmentDto implements Iterable, Countable {
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

    getPrice(): number {
        let price = 0;
        const iterator = this.getIterator();
        while (iterator.hasNext()) {
            price += iterator.next().getPrice();
        }
        return price;
    }

    getIterator(): Iterator {
        return new this.ShipmentDtoIterator(this.orderItems);
    }

    private ShipmentDtoIterator = class implements Iterator {
        private orderItems = [];
        private index = 0;

        constructor(orderItems: OrderItemDto[]) {
            if (Array.isArray(orderItems)) {
                this.orderItems = orderItems;
            }
        }

        hasNext(): boolean {
            return this.index < this.orderItems.length;
        }

        next() {
            return this.hasNext() ? this.orderItems[this.index++] : null;
        }
    };
};
