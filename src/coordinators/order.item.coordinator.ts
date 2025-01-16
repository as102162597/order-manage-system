import { Injectable } from "@nestjs/common";
import { QueryRunner } from "typeorm";
import { Shipment } from "src/entities/shipment.entity";
import { OrderItem } from "src/entities/order.items.entity";
import { OrderItemDto } from "src/dtos/order.item.dto";
import { OrderItemService } from "src/services/order.item.service";
import { Mapper } from "src/mappers/mapper";
import { OrderItemMapperConfig } from "src/mappers/order.item.mapper.config";
import { ObjectChecker } from "src/common/object.checker";

@Injectable()
export class OrderItemCoordinator {
    private readonly orderItemMapper = new Mapper(
        new OrderItemMapperConfig(), OrderItemDto, OrderItem);
    private readonly objectChecker = new ObjectChecker(OrderItem.name);

    constructor(private readonly orderItemService: OrderItemService) {}

    async createOrderItems(
        queryRunner: QueryRunner,
        shipment: Shipment,
        orderItems: OrderItem[]
    ): Promise<void> {
        if (Array.isArray(orderItems)) {
            for (const orderItem of orderItems) {
                await this.createOrderItemRecursively(queryRunner, shipment, orderItem);
            }
        }
    }

    async findByShipmentId(id: number): Promise<OrderItemDto[]> {
        this.objectChecker.argvExist({ id });
        const orderItemDaos = await this.orderItemService.findByShipmentId(id);
        return this.getDtos(orderItemDaos);
    }

    async updateOrderItems(
        queryRunner: QueryRunner,
        orderItemDtos: Partial<OrderItemDto>[]
    ): Promise<void> {
        if (Array.isArray(orderItemDtos)) {
            for (const orderItemDto of orderItemDtos) {
                await this.updateOrderItem(queryRunner, orderItemDto);
            }
        }
    }

    async removeByShipmentId(queryRunner: QueryRunner, id: number): Promise<void> {
        await this.orderItemService.removeByShipmentId(queryRunner, id);
    }

    async areaAnalyze(location = '', orderBy = 'price'): Promise<any> {
        return await this.orderItemService.areaAnalyze(location, orderBy);
    }

    checkCreateOrderItemsInput(orderItemDtos: OrderItemDto[]): void {
        if (Array.isArray(orderItemDtos)) {
            for (const orderItemDto of orderItemDtos) {
                this.checkCreateOrderItemInput(orderItemDto);
            }
        }
    }

    checkUpdateInputs(orderItems: OrderItemDto[], originals: OrderItemDto[]): void {
        if (Array.isArray(orderItems)) {
            this.objectChecker.hasNoDuplicate(orderItems, [ 'id' ]);
            this.objectChecker.includes(orderItems, originals, [ 'id' ]);
        }
    }

    getDaos(orderItemDtos: Partial<OrderItemDto>[]): OrderItem[] {
        let orderItemDaos: OrderItem[] = [];
        if (Array.isArray(orderItemDtos)) {
            orderItemDaos = orderItemDtos.map(orderItemDto => this.getDao(orderItemDto));
        }
        return orderItemDaos;
    }

    getDtos(orderItemDaos: OrderItem[]): OrderItemDto[] {
        let orderItemDtos: OrderItemDto[] = [];
        if (Array.isArray(orderItemDaos)) {
            orderItemDtos = orderItemDaos.map(orderItemDao => this.getDto(orderItemDao));
        }
        return orderItemDtos;
    }

    private async createOrderItemRecursively(
        queryRunner: QueryRunner,
        shipment: Shipment,
        orderItem: OrderItem
    ): Promise<void> {
        orderItem.shipment = shipment;
        await this.orderItemService.create(queryRunner, orderItem);
    }

    private async updateOrderItem(
        queryRunner: QueryRunner,
        orderItemDto: Partial<OrderItemDto>
    ): Promise<void> {
        const orderItemDao = this.getDao(orderItemDto);
        await this.orderItemService.update(queryRunner, orderItemDto.id, orderItemDao);
    }

    private checkCreateOrderItemInput(orderItemDto: OrderItemDto): void {
        this.objectChecker.isObject(orderItemDto);
        this.objectChecker.hasNoFields(orderItemDto, [ 'id' ]);
        this.objectChecker.hasFields(orderItemDto, [ 'productName', 'quantity', 'price' ]);
    }

    private getDao(orderItemDto: Partial<OrderItemDto>): OrderItem {
        return this.orderItemMapper.getDao(orderItemDto);
    }

    private getDto(orderItemDao: OrderItem): OrderItemDto {
        return this.orderItemMapper.getDto(orderItemDao);
    }
};
