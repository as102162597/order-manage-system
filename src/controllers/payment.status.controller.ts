import { Controller } from "@nestjs/common";
import { PaymentStatusCoordinator } from "src/coordinators/payment.status.coordinator";

@Controller('payment-status')
export class PaymentStatusController {
    constructor(private readonly paymentStatusCoordinator: PaymentStatusCoordinator) {}
};
