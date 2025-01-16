import { Injectable } from "@nestjs/common";
import { PaymentStatusService } from "src/services/payment.status.service";

@Injectable()
export class PaymentStatusCoordinator {
    constructor(private readonly orderItemService: PaymentStatusService) {}
};
