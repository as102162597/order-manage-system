import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository, UpdateResult } from "typeorm";
import { Shipment } from "src/entities/shipment.entity";
import { FieldContainer } from "src/common/field.container";

@Injectable()
export class ShipmentService {
    constructor(
        @InjectRepository(Shipment)
        private shipmentRepository: Repository<Shipment>
    ) {}

    async create(queryRunner: QueryRunner, shipment: Shipment): Promise<Shipment> {
        new FieldContainer(shipment, [ 'id' ]);
        return await queryRunner.manager.save(Shipment, shipment);
    }

    async findByOrderId(id: number, deleted = false): Promise<Shipment[]> {
        return await this.shipmentRepository.find({ where: { order: { id }, deleted } }) || [];
    }

    async update(queryRunner: QueryRunner, id: number, shipment: Shipment): Promise<UpdateResult> {
        shipment.id = id;
        const container = new FieldContainer(shipment, [ 'orderItems' ]);
        const result = await queryRunner.manager.getRepository(Shipment).update({ id }, shipment);
        container.restore(shipment);
        return result;
    }

    async remove(queryRunner: QueryRunner, id: number): Promise<void> {
        await queryRunner.manager.delete(Shipment, id);
    }
};
