import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentStatus } from './entities/payment.status.entity';
import { Order } from './entities/order.entity';
import { Shipment } from './entities/shipment.entity';
import { OrderItem } from './entities/order.items.entity';
import { OrderModule } from './modules/order.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '0000',
            database: 'order_manage_system',
            entities: [ PaymentStatus, Order, Shipment, OrderItem ],
            synchronize: true
        }),
        OrderModule
    ],
    controllers: [ AppController ],
    providers: [ AppService ]
})
export class AppModule {}
