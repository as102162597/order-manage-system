import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentStatus } from "src/entities/payment.status.entity";
import { PaymentStatusService } from "src/services/payment.status.service";
import { PaymentStatusCoordinator } from "src/coordinators/payment.status.coordinator";
import { PaymentStatusController } from "src/controllers/payment.status.controller";
import { Order } from "src/entities/order.entity";
import { OrderService } from "src/services/order.service";
import { OrderCoordinator } from "src/coordinators/order.coordinator";
import { OrderController } from "src/controllers/order.controller";
import { Shipment } from "src/entities/shipment.entity";
import { ShipmentService } from "src/services/shipment.service";
import { ShipmentCoordinator } from "src/coordinators/shipment.coordinator";
import { ShipmentController } from "src/controllers/shipment.controller";
import { OrderItem } from "src/entities/order.items.entity";
import { OrderItemService } from "src/services/order.item.service";
import { OrderItemCoordinator } from "src/coordinators/order.item.coordinator";
import { OrderItemController } from "src/controllers/order.item.controller";

@Module({
    imports: [ TypeOrmModule.forFeature([ PaymentStatus, Order, Shipment, OrderItem ])  ],
    providers: [
        PaymentStatusService,
        OrderService,
        ShipmentService,
        OrderItemService,
        PaymentStatusCoordinator,
        OrderCoordinator,
        ShipmentCoordinator,
        OrderItemCoordinator,
    ],
    controllers: [
        PaymentStatusController,
        OrderController,
        ShipmentController,
        OrderItemController
    ]
})
export class OrderModule {};
