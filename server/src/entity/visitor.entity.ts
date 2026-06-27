import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VisitorStatus } from '../common/enums/visitor.enum';
import { Tenants } from './tenants.entity';

@Entity()
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  visitorName: string;

  @Column({ nullable: true })
  visitorPhone: string;

  @Column({ type: 'timestamp' })
  visitDate: Date;

  @Column({ nullable: true })
  expectedArrival: string;

  @Column({ nullable: true })
  purpose: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: VisitorStatus,
    default: VisitorStatus.PENDING,
  })
  status: VisitorStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Tenants, { onDelete: 'CASCADE' })
  tenant: Tenants;
}
