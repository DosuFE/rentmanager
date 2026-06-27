import { Role } from '../common/enums/role.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Property } from './property.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({ type: 'enum', enum: Role, default: Role.LANDLORD })
  role!: Role;

  @Column({ nullable: true })
  bankName?: string;

  @Column({ nullable: true })
  accountNumber?: string;

  @Column({ nullable: true })
  accountName?: string;

  @OneToMany(() => Property, (property) => property.landlord)
  properties!: Property[];
}
