const paymentStatusSource = [
    { id: 1,    code: 'UNPAID',     enus: 'Unpaid',             zhtw: '未付款' },
    { id: 2,    code: 'FAILED',     enus: 'Payment Failed',     zhtw: '付款失敗' },
    { id: 3,    code: 'OVERDUE',    enus: 'Payment Overdue',    zhtw: '超過付款時間' },
    { id: 4,    code: 'PAID',       enus: 'Paid',               zhtw: '已付款' },
    { id: 5,    code: 'REFUNDING',  enus: 'Refund in Progress', zhtw: '退款中' },
    { id: 6,    code: 'REFUNDED',   enus: 'Refunded',           zhtw: '已退款' }
];

const language = 'zhtw';

export const paymentStatusData =
    (field => paymentStatusSource.map(o => ({ id: o.id, name: o[field] })))(language);

export function getPaymentStatus(field: string, value: any): { id: number, name: string } {
    for (const paymentStatus of paymentStatusData) {
        if (paymentStatus[field] === value) {
            return paymentStatus;
        }
    }
    return null;
}

export function getPaymentStatusValue(
    sourceField: string,
    sourceValue: any,
    targetField: string
): any {
    for (const paymentStatus of paymentStatusSource) {
        if (paymentStatus[sourceField] === sourceValue) {
            return paymentStatus[targetField];
        }
    }
}
