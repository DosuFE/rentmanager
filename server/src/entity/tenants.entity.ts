import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Payment } from './payment.entity';
import { User } from './users.entity';
import { Room } from './room.entity';

@Entity()
export class Tenants {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @ManyToOne(() => User)
  landlord: User;

  @ManyToOne(() => Room, (room) => room.tenants, {
    nullable: true,
  })
  room: Room;

  @OneToMany(() => Payment, (payment) => payment.tenant)
  payments: Payment[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
