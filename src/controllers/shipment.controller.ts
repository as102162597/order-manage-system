import { Controller } from "@nestjs/common";
import { ShipmentCoordinator } from "src/coordinators/shipment.coordinator";

@Controller('shipment')
export class ShipmentController {
    constructor(private readonly shipmentCoordinator: ShipmentCoordinator) {}
};
