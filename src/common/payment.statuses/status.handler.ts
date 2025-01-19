import { Status } from "./status";
import { StatusFactory } from "./status.factory";

export class StatusHandler {
    private statuses = {
        UNPAID: StatusFactory.create('UNPAID', this),
        FAILED: StatusFactory.create('FAILED', this),
        OVERDUE: StatusFactory.create('OVERDUE', this),
        PAID: StatusFactory.create('PAID', this),
        REFUNDING: StatusFactory.create('REFUNDING', this),
        REFUNDED: StatusFactory.create('REFUNDED', this)
    }

    private currentStatus: Status;

    constructor(code: string) {
        this.currentStatus = this.statuses[code];
    };

    paymentSucceeded(): StatusHandler {
        this.currentStatus.paymentSucceeded();
        return this;
    }

    paymentFailed(): StatusHandler {
        this.currentStatus.paymentFailed();
        return this;
    }

    overdue(): StatusHandler {
        this.currentStatus.overdue();
        return this;
    }

    requestRefund(): StatusHandler {
        this.currentStatus.requestRefund();
        return this;
    }

    completeRefund(): StatusHandler {
        this.currentStatus.completeRefund();
        return this;
    }

    getId(): number {
        return this.currentStatus.getId();
    }

    setStatus(status: Status): void {
        this.currentStatus = status;
    }

    getUnpaidStatus(): Status {
        return this.statuses.UNPAID;
    }

    getFailedStatus(): Status {
        return this.statuses.FAILED;
    }

    getOverdueStatus(): Status {
        return this.statuses.OVERDUE;
    }

    getPaidStatus(): Status {
        return this.statuses.PAID;
    }

    getRefundingStatus(): Status {
        return this.statuses.REFUNDING;
    }

    getRefundedStatus(): Status {
        return this.statuses.REFUNDED;
    }
};
