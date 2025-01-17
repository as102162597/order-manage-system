import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentStatus } from './entities/payment.status.entity';
import { Order } from './entities/order.entity';
import { Shipment } from './entities/shipment.entity';
import { OrderItem } from './entities/order.items.entity';
import { OrderModule } from './modules/order.module';
import { configuration } from './configuration';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: configuration.dbms.dialect,
            host: configuration.dbms.host,
            port: configuration.dbms.port,
            username: configuration.dbms.username,
            password: configuration.dbms.password,
            database: configuration.dbms.database,
            entities: [ PaymentStatus, Order, Shipment, OrderItem ],
            synchronize: true
        }),
        OrderModule
    ],
    controllers: [ AppController ],
    providers: [ AppService ]
})
export class AppModule {}
