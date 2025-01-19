import { MapperConfig } from "./mapper.config";

export class OrderMapperConfig implements MapperConfig {
    getSharedFields(): string[] {
        return [
            'id',
            'salesChannel',
            'code',
            'customerName',
            'shippingAddress',
            'deliveryMethod',
            'paymentMethod',
            'status',
            'placementDate',
            'deliveryDate'
        ];
    }
};
