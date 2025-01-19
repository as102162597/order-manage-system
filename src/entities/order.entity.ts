import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { PaymentStatus } from './payment.status.entity';
import { Shipment } from './shipment.entity';

@Entity('orders')
@Unique([ 'salesChannel', 'code' ])
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    salesChannel: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    code: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: null })
    customerName: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: null })
    shippingAddress: string;

    @Column({ type: 'varchar', length: 50, nullable: true, default: null })
    deliveryMethod: string;

    @Column({ type: 'varchar', length: 50, nullable: true, default: null })
    paymentMethod: string;

    @ManyToOne(() => PaymentStatus, (paymentStatus) => paymentStatus.id, { nullable: false })
    @JoinColumn({ name: 'payment_status' })
    paymentStatus: PaymentStatus;

    @Column({ name: 'payment_status', type: 'int', nullable: false, default: 1 })
    paymentStatusId: number;

    @Column({ type: 'varchar', length: 50, nullable: true, default: null })
    status: string;

    @Column({ type: 'datetime', nullable: true, default: null })
    placementDate: Date;

    @Column({ type: 'datetime', nullable: true, default: null })
    deliveryDate: Date;

    @Column({ type: 'boolean', nullable: false, default: false })
    deleted: boolean;

    shipments: Shipment[];
};
