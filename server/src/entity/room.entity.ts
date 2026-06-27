import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Property } from './property.entity';
import { Tenants } from './tenants.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomNumber: string;

  @Column()
  floor: number;

  @Column()
  capacity: number;

  @Column({
    default: true,
  })
  isAvailable: boolean;

  @ManyToOne(() => Property, (property) => property.rooms)
  property: Property;

  @OneToMany(() => Tenants, (tenant) => tenant.room)
  tenants: Tenants[];
}
