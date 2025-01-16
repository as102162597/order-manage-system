import { Status } from './status';
import { StatusHandler } from './status.handler';

export class UnpaidStatus extends Status {
    constructor(id: number, owner: StatusHandler) {
        super(id, owner);
    }

    paymentSucceeded(): void {
        this.owner.setStatus(this.owner.getPaidStatus());
    }

    paymentFailed(): void {
        this.owner.setStatus(this.owner.getFailedStatus());
    }

    overdue(): void {
        this.owner.setStatus(this.owner.getOverdueStatus());
    }

    requestRefund(): void {
        this.rejector.reject('Refund cannot be requested as the payment has not been completed');
    }

    completeRefund(): void {
        this.rejector.reject(
            'Refund cannot be marked as completed because no payment has been made');
    }
};
