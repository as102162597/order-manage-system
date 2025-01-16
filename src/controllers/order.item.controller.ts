import { Controller, Get, Query } from "@nestjs/common";
import { OrderItemCoordinator } from "src/coordinators/order.item.coordinator";

@Controller('order-item')
export class OrderItemController {
    constructor(private readonly orderItemCoordinator: OrderItemCoordinator) {}

    @Get('area/analyze')
    async areaAnalyze(
        @Query('location') location = '',
        @Query('orderBy') orderBy = 'price'
    ): Promise<any> {
        return this.orderItemCoordinator.areaAnalyze(location, orderBy);
    }
};
