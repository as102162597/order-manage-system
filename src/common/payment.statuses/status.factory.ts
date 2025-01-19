import { getPaymentStatusValue } from 'src/data/payment.status.data';
import { Status } from './status';
import { UnpaidStatus } from './unpaid.status';
import { PaymentFailedStatus } from './payment.failed.status';
import { PaymentOverdueStatus } from './payment.overdue.status';
import { PaidStatus } from './paid.status';
import { RefundingStatus } from './refunding.status';
import { RefundedStatus } from './refunded.status';
import { StatusHandler } from './status.handler';

export class StatusFactory {
    static createHandler(argv: number | string): StatusHandler {
        const code = typeof argv === 'number' ? getPaymentStatusValue('id', argv, 'code') : argv;
        return new StatusHandler(code);
    }

    static create(argv: number | string, owner: StatusHandler): Status {
        const id = typeof argv === 'number' ? argv : getPaymentStatusValue('code', argv, 'id');
        const code = typeof argv === 'string' ? argv : getPaymentStatusValue('id', argv, 'code');
        switch (code) {
            case 'UNPAID':
                return new UnpaidStatus(id, owner);
            case 'FAILED':
                return new PaymentFailedStatus(id, owner);
            case 'OVERDUE':
                return new PaymentOverdueStatus(id, owner);
            case 'PAID':
                return new PaidStatus(id, owner);
            case 'REFUNDING':
                return new RefundingStatus(id, owner);
            case 'REFUNDED':
                return new RefundedStatus(id, owner);
            default:
                return null;
        }
    }
};
