import { DataSource, QueryRunner } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Order } from "src/entities/order.entity";
import { OrderDto } from "src/dtos/order.dto";
import { OrderService } from "src/services/order.service";
import { ShipmentCoordinator } from "./shipment.coordinator";
import { Mapper } from "src/mappers/mapper";
import { OrderMapperConfig } from "src/mappers/order.mapper.config";
import { ObjectChecker } from "src/common/object.checker";

@Injectable()
export class OrderCoordinator {
    private readonly orderMapper = new Mapper(
        new OrderMapperConfig(), OrderDto, Order);
    private readonly objectChecker = new ObjectChecker(Order.name);

    constructor(
        private readonly orderService: OrderService,
        private readonly shipmentCoordinator: ShipmentCoordinator,
        private readonly dataSource: DataSource
    ) {}

    async create(orderDto: OrderDto): Promise<void> {
        this.checkCreateInputRecursively(orderDto);
        const orderDao = this.getDao(orderDto);
        await this.createWithTransaction(orderDao);
    }

    async findOneById(id: number): Promise<OrderDto> {
        this.objectChecker.argvExist({ id });
        const orderDao = await this.orderService.findOneById(id);
        const orderDto = this.getDto(orderDao);
        orderDto.shipments = await this.shipmentCoordinator.findByOrderId(id);
        return orderDto;
    }

    async findOneBySalesChannelAndCode(salesChannel: string, code: string): Promise<OrderDto> {
        this.objectChecker.argvExist({ salesChannel, code });
        const orderDao = await this.orderService.findOneBySalesChannelAndCode(salesChannel, code);
        const orderDto = this.getDto(orderDao);
        orderDto.shipments = await this.shipmentCoordinator.findByOrderId(orderDto.id);
        return orderDto;
    }

    async findBySizeAndPage(size: number, page: number, deleted = false): Promise<OrderDto[]> {
        this.objectChecker.argvExist({ size, page });
        const orderDaos = await this.orderService.findBySizeAndPage(size, page, deleted);
        const orderDtos = this.getDtos(orderDaos);
        await this.fillShipmentsInDtos(orderDtos);
        return orderDtos;
    }

    async findPageCount(size: number, deleted = false): Promise<number> {
        const count = await this.orderService.findCount(deleted);
        return Math.floor(count / size) + Number(!!(count % size));
    }

    async findPriceById(id: number): Promise<number> {
        const orderDto = await this.findOneById(id);
        return orderDto.calculateTotalPrice();
    }

    async update(orderDto: Partial<OrderDto>): Promise<void> {
        const original = await this.findOneById(orderDto.id);
        this.checkUpdateInputRecursively(orderDto, original);
        await this.updateWithTransaction(orderDto);
    }

    async restoreOneById(id: number): Promise<void> {
        await this.orderService.restore(id);
    }

    async deleteOneById(id: number): Promise<void> {
        await this.orderService.softDelete(id);
    }

    async removeOneById(id: number): Promise<void> {
        await this.orderService.removable(id);
        await this.removeOneByIdWithTransaction(id);
    }

    private async createWithTransaction(order: Order): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await this.createOrderRecursively(queryRunner, order);
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    private async createOrderRecursively(
        queryRunner: QueryRunner,
        order: Order
    ): Promise<void> {
        const newOrder = await this.orderService.create(queryRunner, order);
        await this.shipmentCoordinator.createShipments(queryRunner, newOrder, order.shipments);
    }

    private async fillShipmentsInDtos(orderDtos: OrderDto[]): Promise<void> {
        if (Array.isArray(orderDtos)) {
            for (const i in orderDtos) {
                orderDtos[i].shipments =
                    await this.shipmentCoordinator.findByOrderId(orderDtos[i].id);
            }
        }
    }

    private async updateWithTransaction(orderDto: Partial<OrderDto>): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await this.updateOrderRecursively(queryRunner, orderDto);
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    private async updateOrderRecursively(
        queryRunner: QueryRunner,
        orderDto: Partial<OrderDto>
    ): Promise<void> {
        const orderDao = this.getDao(orderDto);
        await this.orderService.update(queryRunner, orderDto.id, orderDao);
        await this.shipmentCoordinator.updateShipments(queryRunner, orderDto.shipments);
    }

    private async removeOneByIdWithTransaction(id: number): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await this.removeRecursively(queryRunner, id);
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    private async removeRecursively(queryRunner: QueryRunner, id: number): Promise<void> {
        await this.shipmentCoordinator.removeByOrderId(queryRunner, id);
        await this.orderService.remove(queryRunner, id);
    }

    private checkCreateInputRecursively(orderDto: OrderDto): void {
        this.objectChecker.isObject(orderDto);
        this.objectChecker.hasNoFields(orderDto, [ 'id' ]);
        this.objectChecker.hasFields(orderDto, [ 'salesChannel', 'code' ]);
        this.shipmentCoordinator.checkCreateShipmentsInput(orderDto.shipments);
    }

    private checkUpdateInputRecursively(
        orderDto: Partial<OrderDto>,
        original: OrderDto
    ): void {
        this.shipmentCoordinator.checkUpdateInputs(orderDto.shipments, original.shipments);
    }

    private getDaos(orderDtos: Partial<OrderDto>[]): Order[] {
        let orderDaos: Order[] = [];
        if (Array.isArray(orderDtos)) {
            orderDaos = orderDtos.map(orderDto => this.getDao(orderDto));
        }
        return orderDaos;
    }

    private getDtos(orderDaos: Order[]): OrderDto[] {
        let orderDtos: OrderDto[] = [];
        if (Array.isArray(orderDaos)) {
            orderDtos = orderDaos.map(orderDao => this.getDto(orderDao));
        }
        return orderDtos;
    }

    private getDao(orderDto: Partial<OrderDto>): Order {
        if (orderDto) {
            const orderDao = this.orderMapper.getDao(orderDto);
            orderDao.shipments = this.shipmentCoordinator.getDaos(orderDto.shipments);
            return orderDao;
        } else {
            return null;
        }
    }

    private getDto(orderDao: Order): OrderDto {
        if (orderDao) {
            const orderDto = this.orderMapper.getDto(orderDao);
            orderDto.shipments = this.shipmentCoordinator.getDtos(orderDao.shipments);
            return orderDto;
        } else {
            return null;
        }
    }
};
