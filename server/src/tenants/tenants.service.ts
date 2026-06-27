import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { Tenants } from '../entity/tenants.entity';

import { User } from '../entity/users.entity';

import { Role } from '../common/enums/role.enum';

import { CreateTenantDto } from '../common/dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenants)
    private tenantRepo: Repository<Tenants>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateTenantDto, landlordId: string) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const existingUser = await this.userRepo.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      fullName: dto.fullName,
      email: normalizedEmail,
      password: hashedPassword,
      role: Role.TENANT,
    });

    const savedUser = await this.userRepo.save(user);

    const tenant = this.tenantRepo.create({
      name: dto.fullName,
      phoneNumber: dto.phoneNumber,

      landlord: {
        id: landlordId,
      },

      user: savedUser,
    });

    const savedTenant = await this.tenantRepo.save(tenant);

    const result = await this.tenantRepo.findOne({
      where: { id: savedTenant.id },
      relations: ['user', 'landlord', 'room'],
    });

    if (result?.user) {
      const { password: _, ...safeUser } = result.user as User & {
        password?: string;
      };
      result.user = safeUser as User;
    }

    return result;
  }

  async findOne(tenantId: number, landlordId: string) {
    const tenant = await this.tenantRepo.findOne({
      where: {
        id: tenantId,
        landlord: {
          id: landlordId,
        },
      },
      relations: ['user', 'room', 'room.property'],
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  findAll(userId: string) {
    return this.tenantRepo.find({
      where: {
        landlord: {
          id: userId,
        },
      },

      relations: ['user', 'room', 'room.property'],
    });
  }

  async getMyProfile(userId: string) {
    const tenant = await this.tenantRepo.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: [
        'user',
        'landlord',
        'room',
        'room.property',
        'payments',
      ],
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    const payments = tenant.payments ?? [];

    const pendingPayments = payments.filter(
      (payment) => payment.status === 'PENDING',
    );
    const overduePayments = payments.filter(
      (payment) => payment.status === 'OVERDUE',
    );
    const paidPayments = payments.filter((payment) => payment.status === 'PAID');

    const outstandingBalance = [...pendingPayments, ...overduePayments].reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );

    const recentPayments = [...payments]
      .sort(
        (a, b) =>
          new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
      )
      .slice(0, 5)
      .map((payment) => ({
        id: payment.id,
        amount: Number(payment.amount),
        dueDate: payment.dueDate,
        status: payment.status,
      }));

    return {
      profile: {
        id: tenant.id,
        name: tenant.name,
        phoneNumber: tenant.phoneNumber,
        email: tenant.user.email,
      },
      landlord: {
        fullName: tenant.landlord.fullName,
        email: tenant.landlord.email,
      },
      room: tenant.room
        ? {
            id: tenant.room.id,
            roomNumber: tenant.room.roomNumber,
            floor: tenant.room.floor,
            capacity: tenant.room.capacity,
            isAvailable: tenant.room.isAvailable,
          }
        : null,
      property: tenant.room?.property
        ? {
            id: tenant.room.property.id,
            name: tenant.room.property.name,
            address: tenant.room.property.address,
            city: tenant.room.property.city,
            state: tenant.room.property.state,
          }
        : null,
      stats: {
        totalPayments: payments.length,
        pendingCount: pendingPayments.length,
        overdueCount: overduePayments.length,
        paidCount: paidPayments.length,
        outstandingBalance,
      },
      recentPayments,
    };
  }

  async getMyRoom(userId: string) {
    const tenant = await this.tenantRepo.findOne({
      where: {
        user: {
          id: userId,
        },
      },

      relations: ['room', 'room.property'],
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant.room;
  }
}
