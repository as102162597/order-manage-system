import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Shipment } from './shipment.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Shipment, (shipment) => shipment.id, { nullable: false })
    @JoinColumn({ name: 'shipment_id' })
    shipment: Shipment;

    @Column({ name: 'shipment_id', type: 'int', nullable: false })
    shipmentId: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    productName: string;

    @Column({ type: 'int', nullable: false, default: 1 })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
    price: number;
};
