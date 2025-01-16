import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderCoordinator } from "src/coordinators/order.coordinator";
import { ShipmentCoordinator } from "src/coordinators/shipment.coordinator";
import { OrderItemCoordinator } from "src/coordinators/order.item.coordinator";
import { OrderController } from "src/controllers/order.controller";
import { ShipmentController } from "src/controllers/shipment.controller";
import { OrderItemController } from "src/controllers/order.item.controller";
import { Order } from "src/entities/order.entity";
import { OrderItem } from "src/entities/order.items.entity";
import { Shipment } from "src/entities/shipment.entity";
import { OrderService } from "src/services/order.service";
import { ShipmentService } from "src/services/shipment.service";
import { OrderItemService } from "src/services/order.item.services";

@Module({
    imports: [ TypeOrmModule.forFeature([ Order, Shipment, OrderItem ])  ],
    providers: [
        OrderService,
        ShipmentService,
        OrderItemService,
        OrderCoordinator,
        ShipmentCoordinator,
        OrderItemCoordinator,
    ],
    controllers: [ OrderController, ShipmentController, OrderItemController ]
})
export class OrderModule {};
