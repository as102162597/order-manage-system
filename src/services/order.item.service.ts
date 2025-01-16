import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository, UpdateResult } from "typeorm";
import { OrderItem } from "src/entities/order.items.entity";
import { FieldContainer } from "src/common/field.container";
import { Rejector } from "src/common/rejector";

@Injectable()
export class OrderItemService {
    private readonly validSortingFields = [ 'price', 'quantity' ];
    private readonly rejector = new Rejector();

    constructor(
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>
    ) {}

    async create(queryRunner: QueryRunner, orderItem: OrderItem): Promise<OrderItem> {
        new FieldContainer(orderItem, [ 'id' ]);
        return await queryRunner.manager.save(OrderItem, orderItem);
    }

    async findByShipmentId(id: number): Promise<OrderItem[]> {
        return await this.orderItemRepository.find({
            where: { shipment: { id } },
            order: { id: 'ASC' }
        }) || [];
    }

    async update(
        queryRunner: QueryRunner,
        id: number,
        orderItem: OrderItem
    ): Promise<UpdateResult> {
        orderItem.id = id;
        const result = await queryRunner
            .manager
            .getRepository(OrderItem)
            .update({ id }, orderItem);
        return result;
    }

    async removeByShipmentId(queryRunner: QueryRunner, id: number): Promise<void> {
        await queryRunner.manager.delete(OrderItem, { shipment: { id } });
    }

    async areaAnalyze(location = '', orderBy = 'price'): Promise<any> {
        this.checkArgumentOrderBy(orderBy);
        return this.areaAnalyzeByLocation(location, orderBy);
    }

    private async areaAnalyzeByLocation(location = '', orderBy = 'price'): Promise<any> {
        return await this.orderItemRepository
            .createQueryBuilder('item')
            .select('item.tag', 'tag')
            .addSelect('SUM(item.quantity)', 'quantity')
            .addSelect('SUM(item.quantity * item.price)', 'price')
            .innerJoin('item.shipment', 'shipment')
            .innerJoin('shipment.order', 'order')
            .where('order.shippingAddress LIKE :shippingAddress', {
                shippingAddress: `%${location}%`
            })
            .groupBy('item.tag')
            .orderBy(orderBy, 'DESC')
            .getRawMany();
    }

    private checkArgumentOrderBy(orderBy: string): void {
        if (!this.validSortingFields.includes(orderBy)) {
            this.reject(`Invalid orderBy argument. Please select from the following: ${
                this.arrayToString(this.validSortingFields)
            }`);
        }
    }

    private arrayToString(array: any[]): string {
        if (!array.length) {
            return '';
        } else if (array.length === 1) {
            return `'${array[0]}'`;
        }
        return `'`
            + array.slice(0, array.length - 1).join(`', '`)
            + `' and '${array[array.length - 1]}'`;
    }

    private reject(response: string, status = HttpStatus.BAD_REQUEST): void {
        this.rejector.reject(response, status);
    }
};
