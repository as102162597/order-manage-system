import { Status } from "./status";
import { StatusHandler } from "./status.handler";

export class RefundingStatus extends Status {
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
        this.rejector.reject(`Already in 'Refunding' status`);
    }

    completeRefund(): void {
        this.owner.setStatus(this.owner.getRefundedStatus());
    }
};
