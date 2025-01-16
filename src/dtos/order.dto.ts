import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ShipmentDto } from './shipment.dto';
import { Iterable, Iterator } from 'src/interfaces/iterator';
import { Countable } from 'src/interfaces/countable';

export class OrderDto implements Iterable, Countable {
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

    getPrice(): number {
        let price = 0;
        const iterator = this.getIterator();
        while (iterator.hasNext()) {
            price += iterator.next().getPrice();
        }
        return price;
    }

    getIterator(): Iterator {
        return new this.OrderDtoIterator(this.shipments);
    }

    private OrderDtoIterator = class implements Iterator {
        private shipments = [];
        private index = 0;

        constructor(shipments: ShipmentDto[]) {
            if (Array.isArray(shipments)) {
                this.shipments = shipments;
            }
        }

        hasNext(): boolean {
            return this.index < this.shipments.length;
        }

        next() {
            return this.hasNext() ? this.shipments[this.index++] : null;
        }
    };
};
