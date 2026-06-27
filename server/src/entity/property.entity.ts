import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './users.entity';

import { Room } from './room.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @ManyToOne(() => User, (user) => user.properties)
  landlord: User;

  @OneToMany(() => Room, (room) => room.property)
  rooms: Room[];
}
