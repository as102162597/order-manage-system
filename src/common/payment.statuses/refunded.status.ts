import { Status } from "./status";
import { StatusHandler } from "./status.handler";

export class RefundedStatus extends Status {
    constructor(id: number, owner: StatusHandler) {
        super(id, owner);
    }

    paymentSucceeded(): void {
        this.rejector.reject('Payment has already been processed for this order');
    }

    paymentFailed(): void {
        this.rejector.reject('Payment has already been processed for this order');
    }

    overdue(): void {
        this.rejector.reject('Payment has already been processed for this order');
    }

    requestRefund(): void {
        this.rejector.reject('Refund cannot be requested again');
    }

    completeRefund(): void {
        this.rejector.reject(`Already in 'Refunded' status`);
    }
};
