import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ComplaintCategory,
  ComplaintStatus,
} from '../common/enums/complaint.enum';
import { Tenants } from './tenants.entity';

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ComplaintCategory,
    default: ComplaintCategory.OTHER,
  })
  category: ComplaintCategory;

  @Column({
    type: 'enum',
    enum: ComplaintStatus,
    default: ComplaintStatus.OPEN,
  })
  status: ComplaintStatus;

  @Column({ type: 'text', nullable: true })
  landlordFeedback: string | null;

  @Column({ type: 'timestamp', nullable: true })
  feedbackAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tenants, { onDelete: 'CASCADE' })
  tenant: Tenants;
}
