import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order.items.entity';

@Entity('shipments')
export class Shipment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    code: string;

    @ManyToOne(() => Order, (order) => order.id, { nullable: false })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'order_id', type: 'int', nullable: false })
    orderId: number;

    @Column({ type: 'datetime', nullable: false })
    shipmentDate: Date;

    @Column({ type: 'varchar', length: 255, nullable: false })
    shipmentAddress: string;

    @Column({ type: 'boolean', nullable: false, default: false })
    deleted: boolean;

    orderItems: OrderItem[];
};
