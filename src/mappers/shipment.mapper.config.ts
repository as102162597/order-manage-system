import { MapperConfig } from "./mapper.config";

export class ShipmentMapperConfig implements MapperConfig {
    getSharedFields(): string[] {
        return [
            'id',
            'code',
            'shipmentDate',
            'shipmentAddress'
        ];
    }
};
