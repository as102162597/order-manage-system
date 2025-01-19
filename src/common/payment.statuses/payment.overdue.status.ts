import { Status } from "./status";
import { StatusHandler } from "./status.handler";

export class PaymentOverdueStatus extends Status {
    constructor(id: number, owner: StatusHandler) {
        super(id, owner);
    }

    paymentSucceeded(): void {
        this.rejector.reject('Payment cannot be processed as the payment deadline has passed');
    }

    paymentFailed(): void {
        this.rejector.reject('Payment cannot be processed as the payment deadline has passed');
    }

    overdue(): void {
        this.rejector.reject(`Already in 'Overdue' status`);
    }

    requestRefund(): void {
        this.rejector.reject('Refund cannot be requested as the payment has not been completed');
    }

    completeRefund(): void {
        this.rejector.reject(
            'Refund cannot be marked as completed because no payment has been made');
    }
};
