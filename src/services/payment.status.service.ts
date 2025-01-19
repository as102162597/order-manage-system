import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaymentStatus } from "src/entities/payment.status.entity";
import { paymentStatusData } from "src/data/payment.status.data";

@Injectable()
export class PaymentStatusService implements OnModuleInit {
    constructor(
        @InjectRepository(PaymentStatus)
        private paymentStatusRepository: Repository<PaymentStatus>
    ) {}

    async onModuleInit() {
        await this.paymentStatusRepository.save(paymentStatusData);
    }
};
