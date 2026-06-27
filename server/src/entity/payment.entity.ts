import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Tenants } from './tenants.entity';
import { PaymentStatus } from 'src/common/enums/payment.enum';
import { PaymentMethod } from 'src/common/enums/payment-method.enum';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'timestamp',
  })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod?: PaymentMethod;

  @Column({ nullable: true })
  paystackReference?: string;

  @Column({ nullable: true })
  transactionRef?: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @Column({ default: false })
  landlordSettled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  settledAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Tenants, (tenant) => tenant.payments)
  tenant!: Tenants;
}
