import { Injectable } from "@nestjs/common";
import { QueryRunner } from "typeorm";
import { Order } from "src/entities/order.entity";
import { Shipment } from "src/entities/shipment.entity";
import { ShipmentDto } from "src/dtos/shipment.dto";
import { ShipmentService } from "src/services/shipment.service";
import { OrderItemCoordinator } from "./order.item.coordinator";
import { Mapper } from "src/mappers/mapper";
import { ShipmentMapperConfig } from "src/mappers/shipment.mapper.config";
import { ObjectChecker } from "src/common/object.checker";

@Injectable()
export class ShipmentCoordinator {
    private readonly shipmentMapper = new Mapper(
        new ShipmentMapperConfig(), ShipmentDto, Shipment);
    private readonly objectChecker = new ObjectChecker(Shipment.name);

    constructor(
        private readonly shipmentService: ShipmentService,
        private readonly orderItemCoordinator: OrderItemCoordinator
    ) {}

    async createShipments(
        queryRunner: QueryRunner,
        order: Order,
        shipments: Shipment[]
    ): Promise<void> {
        if (Array.isArray(shipments)) {
            for (const shipment of shipments) {
                await this.createShipmentRecursively(queryRunner, order, shipment);
            }
        }
    }

    async findByOrderId(id: number): Promise<ShipmentDto[]> {
        this.objectChecker.argvExist({ id });
        const shipmentDaos = await this.shipmentService.findByOrderId(id);
        const shipmentDtos = this.getDtos(shipmentDaos);
        await this.fillOrderItemsInDtos(shipmentDtos);
        return shipmentDtos;
    }

    async updateShipments(
        queryRunner: QueryRunner,
        shipmentDtos: Partial<ShipmentDto>[]
    ): Promise<void> {
        for (const shipmentDto of shipmentDtos) {
            await this.updateShipmentRecursively(queryRunner, shipmentDto);
        }
    }

    async removeByOrderId(queryRunner: QueryRunner, id: number): Promise<void> {
        const shipments = await this.findByOrderId(id);
        const shipmentIds = shipments.map(shipment => shipment.id);
        for (const shipmentId of shipmentIds) {
            await this.removeRecursively(queryRunner, shipmentId);
        }
    }

    checkCreateShipmentsInput(shipmentDtos: ShipmentDto[]): void {
        if (Array.isArray(shipmentDtos)) {
            for (const shipmentDto of shipmentDtos) {
                this.checkCreateShipmentInputRecursively(shipmentDto);
            }
            this.objectChecker.hasNoDuplicate(shipmentDtos, [ 'code' ]);
        }
    }

    checkUpdateInputs(shipments: ShipmentDto[], originals: ShipmentDto[]): void {
        if (Array.isArray(shipments)) {
            this.objectChecker.hasNoDuplicate(shipments, [ 'id', 'code' ]);
            this.objectChecker.includes(shipments, originals, [ 'id' ]);
            for (const shipment of shipments) {
                const original = originals.find(original => original.id === shipment.id);
                this.checkUpdateInputRecursively(shipment, original);
            }
        }
    }

    getDaos(shipmentDtos: Partial<ShipmentDto>[]): Shipment[] {
        let shipmentDaos: Shipment[] = [];
        if (Array.isArray(shipmentDtos)) {
            shipmentDaos = shipmentDtos.map(shipmentDto => this.getDao(shipmentDto));
        }
        return shipmentDaos;
    }

    getDtos(shipmentDaos: Shipment[]): ShipmentDto[] {
        let shipmentDtos: ShipmentDto[] = [];
        if (Array.isArray(shipmentDaos)) {
            shipmentDtos = shipmentDaos.map(shipmentDao => this.getDto(shipmentDao));
        }
        return shipmentDtos;
    }

    private async createShipmentRecursively(
        queryRunner: QueryRunner,
        order: Order,
        shipment: Shipment
    ): Promise<void> {
        shipment.order = order;
        const newShipment = await this.shipmentService.create(queryRunner, shipment);
        await this.orderItemCoordinator.createOrderItems(
            queryRunner, newShipment, shipment.orderItems);
    }

    private async fillOrderItemsInDtos(shipmentDtos: ShipmentDto[]): Promise<void> {
        if (Array.isArray(shipmentDtos)) {
            for (const i in shipmentDtos) {
                shipmentDtos[i].orderItems =
                    await this.orderItemCoordinator.findByShipmentId(shipmentDtos[i].id);
            }
        }
    }

    private async updateShipmentRecursively(
        queryRunner: QueryRunner,
        shipmentDto: Partial<ShipmentDto>
    ): Promise<void> {
        const shipmentDao = this.getDao(shipmentDto);
        await this.shipmentService.update(queryRunner, shipmentDto.id, shipmentDao);
        await this.orderItemCoordinator.updateOrderItems(queryRunner, shipmentDto.orderItems);
    }

    private async removeRecursively(queryRunner: QueryRunner, id: number): Promise<void> {
        await this.orderItemCoordinator.removeByShipmentId(queryRunner, id);
        await this.shipmentService.remove(queryRunner, id);
    }

    private checkCreateShipmentInputRecursively(shipmentDto: ShipmentDto): void {
        this.objectChecker.isObject(shipmentDto);
        this.objectChecker.hasNoFields(shipmentDto, [ 'id' ]);
        this.objectChecker.hasFields(shipmentDto, [ 'code', 'shipmentDate', 'shipmentAddress' ]);
        this.orderItemCoordinator.checkCreateOrderItemsInput(shipmentDto.orderItems);
    }

    private checkUpdateInputRecursively(
        shipmentDto: ShipmentDto | Partial<ShipmentDto>,
        original: ShipmentDto
    ): void {
        this.orderItemCoordinator.checkUpdateInputs(
            shipmentDto.orderItems, original.orderItems);
    }

    private getDao(shipmentDto: Partial<ShipmentDto>): Shipment {
        if (shipmentDto) {
            const shipmentDao = this.shipmentMapper.getDao(shipmentDto);
            shipmentDao.orderItems = this.orderItemCoordinator.getDaos(shipmentDto.orderItems);
            return shipmentDao;
        }
        return null;
    }

    private getDto(shipmentDao: Shipment): ShipmentDto {
        if (shipmentDao) {
            const shipmentDto = this.shipmentMapper.getDto(shipmentDao);
            shipmentDto.orderItems = this.orderItemCoordinator.getDtos(shipmentDao.orderItems);
            return shipmentDto;
        }
        return null;
    }
};
