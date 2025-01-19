import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository, UpdateResult } from "typeorm";
import { Shipment } from "src/entities/shipment.entity";
import { FieldContainer } from "src/common/field.container";
import { Rejector } from "src/common/rejector";

@Injectable()
export class ShipmentService {
    private readonly rejector = new Rejector();

    constructor(
        @InjectRepository(Shipment)
        private shipmentRepository: Repository<Shipment>
    ) {}

    async create(queryRunner: QueryRunner, shipment: Shipment): Promise<Shipment> {
        new FieldContainer(shipment, [ 'id' ]);
        return await queryRunner.manager.save(Shipment, shipment);
    }

    async findOne(object: Partial<Shipment>): Promise<Shipment> {
        const shipment = await this.shipmentRepository.findOne({ where: object });
        if (!shipment) {
            this.reject(`${Shipment.name} not found`, HttpStatus.NOT_FOUND);
        }
        return shipment;
    }

    async findOneById(id: number, deleted = false): Promise<Shipment> {
        try {
            return await this.findOne({ id, deleted });
        } catch (e) {
            this.reject(`${Shipment.name} with id '${id}' not found`, HttpStatus.NOT_FOUND);
        }
    }

    async findOneByCode(code: string, deleted = false): Promise<Shipment> {
        try {
            return await this.findOne({ code, deleted });
        } catch (e) {
            this.reject(`${Shipment.name} with code '${code}' not found`, HttpStatus.NOT_FOUND);
        }
    }

    async findByOrderId(id: number, deleted = false): Promise<Shipment[]> {
        return await this.shipmentRepository.find({
            where: { order: { id }, deleted },
            order: { id: 'ASC' }
        }) || [];
    }

    async findBySizeAndPage(size: number, page: number, deleted = false): Promise<Shipment[]> {
        this.checkFindBySizeAndPageInputs(size, page);
        return await this.shipmentRepository.find({
            where: { deleted },
            order: { id: 'ASC' },
            take: size,
            skip: (page - 1) * size
        }) || [];
    }

    async findCount(deleted = false): Promise<number> {
        return this.shipmentRepository.count({ where: { deleted } });
    }

    async findPageCount(size: number, deleted = false): Promise<number> {
        this.checkFindBySizeAndPageInputs(size, 1);
        const count = await this.findCount(deleted);
        return Math.floor(count / size) + Number(!!(count % size));
    }

    async update(queryRunner: QueryRunner, id: number, shipment: Shipment): Promise<UpdateResult> {
        shipment.id = id;
        const container = new FieldContainer(shipment, [ 'orderItems' ]);
        const result = await queryRunner.manager.getRepository(Shipment).update({ id }, shipment);
        container.restore(shipment);
        return result;
    }

    async restore(id: number): Promise<UpdateResult> {
        const shipment = await this.findOne({ id });
        if (!shipment.deleted) {
            this.reject(`${Shipment.name} with id '${id}' has not been deleted`);
        }
        return await this.shipmentRepository.update(id, { deleted: false });
    }

    async softDelete(id: number): Promise<UpdateResult> {
        const shipment = await this.findOne({ id });
        if (shipment.deleted) {
            this.reject(`${Shipment.name} with id '${id}' is deleted`);
        }
        return await this.shipmentRepository.update(id, { deleted: true });
    }

    async removable(id: number): Promise<void> {
        const shipment = await this.findOne({ id });
        if (!shipment.deleted) {
            this.reject(
                `${Shipment.name} '${id}' cannot be permanently removed as it is not marked as deleted`,
                HttpStatus.FORBIDDEN
            );
        }
    }

    async remove(queryRunner: QueryRunner, id: number): Promise<void> {
        await queryRunner.manager.delete(Shipment, id);
    }

    private checkFindBySizeAndPageInputs(size: number, page: number): void {
        if (size < 1) {
            this.reject("Argument 'size' must be greater than or equal to 1");
        } else if (page < 1) {
            this.reject("Argument 'page' must be greater than or equal to 1");
        } else if (!Number.isInteger(size)) {
            this.reject("Argument 'size' must be an integer");
        } else if (!Number.isInteger(page)) {
            this.reject("Argument 'page' must be an integer");
        }
    }

    private reject(response: string, status = HttpStatus.BAD_REQUEST): void {
        this.rejector.reject(response, status);
    }
};
