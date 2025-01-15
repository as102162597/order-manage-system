import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryRunner, Repository, UpdateResult } from "typeorm";
import { Order } from "src/entities/order.entity";
import { Rejector } from "src/common/rejector";
import { FieldContainer } from "src/common/field.container";

@Injectable()
export class OrderService {
    private readonly rejector = new Rejector();

    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>
    ) {}

    async create(queryRunner: QueryRunner, order: Order): Promise<Order> {
        new FieldContainer(order, [ 'id' ]);
        return await queryRunner.manager.save(Order, order);
    }

    async findOne(object: Partial<Order>): Promise<Order> {
        const order = await this.orderRepository.findOne({ where: object });
        if (!order) {
            this.reject(`${Order.name} not found`);
        }
        return order;
    }

    async findOneById(id: number, deleted = false): Promise<Order> {
        try {
            return await this.findOne({ id, deleted });
        } catch (e) {
            this.reject(`${Order.name} with id '${id}' not found`);
        }
    }

    async findOneBySalesChannelAndCode(
        salesChannel: string,
        code: string,
        deleted = false
    ): Promise<Order> {
        try {
            return await this.findOne({ salesChannel, code, deleted });
        } catch (e) {
            this.reject(`${Order.name} with salesChannel '${salesChannel}' and code '${code}' not found`);
        }
    }

    async findBySizeAndPage(size: number, page: number, deleted = false): Promise<Order[]> {
        this.checkFindBySizeAndPageInputs(size, page);
        return await this.orderRepository.find({
            where: { deleted },
            order: { id: 'ASC' },
            take: size,
            skip: (page - 1) * size
        }) || [];
    }

    async findCount(deleted = false): Promise<number> {
        return this.orderRepository.count({ where: { deleted } });
    }

    async update(queryRunner: QueryRunner, id: number, order: Order): Promise<UpdateResult> {
        order.id = id;
        const container = new FieldContainer(order, [ 'shipments' ]);
        const result = await queryRunner.manager.getRepository(Order).update({ id }, order);
        container.restore(order);
        return result;
    }

    async restore(id: number): Promise<UpdateResult> {
        const order = await this.findOne({ id });
        if (!order.deleted) {
            this.reject(`${Order.name} with id '${id}' has not been deleted`);
        }
        return await this.orderRepository.update(id, { deleted: false });
    }

    async softDelete(id: number): Promise<UpdateResult> {
        const order = await this.findOne({ id });
        if (order.deleted) {
            this.reject(`${Order.name} with id '${id}' is deleted`);
        }
        return await this.orderRepository.update(id, { deleted: true });
    }

    async removable(id: number): Promise<void> {
        const order = await this.findOne({ id });
        if (!order.deleted) {
            this.reject(
                `${Order.name} '${id}' cannot be permanently removed as it is not marked as deleted`,
                HttpStatus.FORBIDDEN
            );
        }
    }

    async remove(queryRunner: QueryRunner, id: number): Promise<void> {
        await queryRunner.manager.delete(Order, id);
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
