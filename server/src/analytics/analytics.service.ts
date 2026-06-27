import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entity/payment.entity';
import { Property } from '../entity/property.entity';
import { Room } from '../entity/room.entity';
import { Tenants } from '../entity/tenants.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,

    @InjectRepository(Room)
    private roomRepo: Repository<Room>,

    @InjectRepository(Tenants)
    private tenantRepo: Repository<Tenants>,
  ) {}

  async getPaymentAnalytics(userId: string) {
    const payments = await this.paymentRepo.find({
      where: {
        tenant: {
          landlord: {
            id: userId,
          },
        },
      },

      relations: ['tenant', 'tenant.landlord'],
    });

    const totalRevenue = payments
      .filter((payment) => payment.status === 'PAID')
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    const overduePayments = payments.filter(
      (payment) => payment.status === 'OVERDUE',
    ).length;

    const unpaidPayments = payments.filter(
      (payment) => payment.status === 'PENDING',
    ).length;

    const monthlyIncome = payments
      .filter((payment) => {
        const paymentMonth = new Date(payment.createdAt).getMonth();

        const currentMonth = new Date().getMonth();

        return payment.status === 'PAID' && paymentMonth === currentMonth;
      })
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    return {
      totalRevenue,
      overduePayments,
      unpaidPayments,
      monthlyIncome,
    };
  }

  async getDashboardStats(userId: string) {
    const totalProperties = await this.propertyRepo.count({
      where: {
        landlord: {
          id: userId,
        },
      },
    });

    const totalRooms = await this.roomRepo.count({
      where: {
        property: {
          landlord: {
            id: userId,
          },
        },
      },
    });

    const occupiedRooms = await this.roomRepo.count({
      where: {
        isAvailable: false,

        property: {
          landlord: {
            id: userId,
          },
        },
      },
    });

    const vacantRooms = await this.roomRepo.count({
      where: {
        isAvailable: true,

        property: {
          landlord: {
            id: userId,
          },
        },
      },
    });

    const totalTenants = await this.tenantRepo.count({
      where: {
        landlord: {
          id: userId,
        },
      },
    });

    const paymentAnalytics = await this.getPaymentAnalytics(userId);

    return {
      totalProperties,
      totalRooms,
      occupiedRooms,
      vacantRooms,
      totalTenants,

      overduePayments: paymentAnalytics.overduePayments,

      monthlyIncome: paymentAnalytics.monthlyIncome,
    };
  }
}
