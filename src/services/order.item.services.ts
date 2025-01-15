import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository, UpdateResult } from "typeorm";
import { OrderItem } from "src/entities/order.items.entity";
import { FieldContainer } from "src/common/field.container";

@Injectable()
export class OrderItemService {
    constructor(
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>
    ) {}

    async create(queryRunner: QueryRunner, orderItem: OrderItem): Promise<OrderItem> {
        new FieldContainer(orderItem, [ 'id' ]);
        return await queryRunner.manager.save(OrderItem, orderItem);
    }

    async findByShipmentId(id: number): Promise<OrderItem[]> {
        return await this.orderItemRepository.find({ where: { shipment: { id } } }) || [];
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
};
