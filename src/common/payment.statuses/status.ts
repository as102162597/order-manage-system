import { HttpStatus } from '@nestjs/common';
import { Rejector } from '../rejector';
import { StatusHandler } from './status.handler';

export abstract class Status {
    protected readonly rejector = new Rejector(HttpStatus.CONFLICT);

    constructor(private readonly id: number, protected readonly owner: StatusHandler) {}

    getId(): number {
        return this.id;
    }

    abstract paymentSucceeded(): void;
    abstract paymentFailed(): void;
    abstract overdue(): void;
    abstract requestRefund(): void;
    abstract completeRefund(): void;
};
