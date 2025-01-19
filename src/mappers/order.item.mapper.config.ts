import { MapperConfig } from "./mapper.config";

export class OrderItemMapperConfig implements MapperConfig {
    getSharedFields(): string[] {
        return [
            'id',
            'productName',
            'quantity',
            'price',
            'tag'
        ];
    }
};
