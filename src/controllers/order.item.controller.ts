import { Controller } from "@nestjs/common";
import { OrderItemCoordinator } from "src/coordinators/order.item.coordinator";

@Controller('order-item')
export class OrderItemController {
    constructor(private readonly orderItemCoordinator: OrderItemCoordinator) {}
};
