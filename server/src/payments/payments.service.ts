import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from '../common/dto/create-payment.dto';
import { Payment } from '../entity/payment.entity';
import { Tenants } from '../entity/tenants.entity';
import { User } from '../entity/users.entity';
import { PaymentStatus } from 'src/common/enums/payment.enum';
import { PaymentMethod } from 'src/common/enums/payment-method.enum';
import { PaystackService } from '../paystack/paystack.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(Tenants)
    private tenantRepo: Repository<Tenants>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private paystackService: PaystackService,
    private notificationsService: NotificationsService,
  ) {}

  private async getTenantPayment(paymentId: string, userId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: [
        'tenant',
        'tenant.user',
        'tenant.landlord',
        'tenant.room',
        'tenant.room.property',
      ],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.tenant.user?.id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return payment;
  }

  private async markPaystackPaymentPaid(
    payment: Payment,
    reference: string,
    transactionRef?: string,
  ) {
    if (payment.status === PaymentStatus.PAID) {
      return payment;
    }

    payment.status = PaymentStatus.PAID;
    payment.paymentMethod = PaymentMethod.PAYSTACK;
    payment.paystackReference = reference;
    payment.transactionRef = transactionRef ?? reference;
    payment.paidAt = new Date();
    payment.landlordSettled = false;

    const saved = await this.paymentRepo.save(payment);

    void this.notificationsService.sendPaymentReceived({
      landlordEmail: payment.tenant.landlord.email,
      landlordName: payment.tenant.landlord.fullName,
      tenantName: payment.tenant.name,
      amount: Number(payment.amount),
      reference: payment.transactionRef,
      method: 'Paystack',
    });

    if (payment.tenant.user?.email) {
      void this.notificationsService.sendPaymentConfirmation({
        tenantEmail: payment.tenant.user.email,
        tenantName: payment.tenant.name,
        amount: Number(payment.amount),
        reference: payment.transactionRef,
      });
    }

    return saved;
  }

  async create(dto: CreatePaymentDto, landlordId: string) {
    const tenant = await this.tenantRepo.findOne({
      where: {
        id: dto.tenantId,
        landlord: { id: landlordId },
      },
      relations: ['landlord'],
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const payment = this.paymentRepo.create({
      amount: dto.amount,
      dueDate: new Date(dto.dueDate),
      tenant,
    });

    return this.paymentRepo.save(payment);
  }

  async initializePaystack(paymentId: string, userId: string) {
    const payment = await this.getTenantPayment(paymentId, userId);

    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException('Payment is already completed');
    }

    if (payment.status === PaymentStatus.PENDING_VERIFICATION) {
      throw new BadRequestException(
        'Payment is awaiting landlord verification',
      );
    }

    const reference = this.paystackService.buildReference(payment.id);

    const result = await this.paystackService.initializeTransaction({
      email: payment.tenant.user.email,
      amount: Number(payment.amount),
      reference,
      paymentId: payment.id,
      tenantId: payment.tenant.id,
      landlordId: payment.tenant.landlord.id,
    });

    payment.paystackReference = result.reference;
    await this.paymentRepo.save(payment);

    return {
      authorizationUrl: result.authorization_url,
      reference: result.reference,
      amount: Number(payment.amount),
    };
  }

  async verifyPaystack(reference: string, userId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { paystackReference: reference },
      relations: ['tenant', 'tenant.user', 'tenant.landlord'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found for this reference');
    }

    if (payment.tenant.user?.id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const verified = await this.paystackService.verifyTransaction(reference);

    if (verified.status !== 'success') {
      throw new BadRequestException('Payment was not successful');
    }

    const expectedAmount = Math.round(Number(payment.amount) * 100);
    if (verified.amount !== expectedAmount) {
      throw new BadRequestException('Payment amount mismatch');
    }

    return this.markPaystackPaymentPaid(payment, reference, verified.reference);
  }

  async handlePaystackWebhook(payload: {
    event: string;
    data: {
      status: string;
      reference: string;
      amount: number;
      metadata?: { paymentId?: string };
    };
  }) {
    if (payload.event !== 'charge.success') {
      return { received: true };
    }

    const { reference, amount, metadata } = payload.data;

    if (payload.data.status !== 'success') {
      return { received: true };
    }

    const payment = await this.paymentRepo.findOne({
      where: { paystackReference: reference },
      relations: ['tenant', 'tenant.user', 'tenant.landlord'],
    });

    if (!payment && metadata?.paymentId) {
      const byId = await this.paymentRepo.findOne({
        where: { id: metadata.paymentId },
        relations: ['tenant', 'tenant.user', 'tenant.landlord'],
      });

      if (byId) {
        await this.markPaystackPaymentPaid(byId, reference, reference);
        return { received: true };
      }
    }

    if (!payment) {
      return { received: true };
    }

    const expectedAmount = Math.round(Number(payment.amount) * 100);
    if (amount !== expectedAmount) {
      return { received: true };
    }

    await this.markPaystackPaymentPaid(payment, reference, reference);
    return { received: true };
  }

  async getBankTransferDetails(paymentId: string, userId: string) {
    const payment = await this.getTenantPayment(paymentId, userId);

    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException('Payment is already completed');
    }

    const landlord = payment.tenant.landlord;

    if (!landlord.bankName || !landlord.accountNumber || !landlord.accountName) {
      throw new BadRequestException(
        'Landlord has not set up bank details yet. Please use Paystack or contact your landlord.',
      );
    }

    return {
      paymentId: payment.id,
      amount: Number(payment.amount),
      reference: this.paystackService.buildTransferReference(payment.id),
      bankName: landlord.bankName,
      accountNumber: landlord.accountNumber,
      accountName: landlord.accountName,
      landlordName: landlord.fullName,
    };
  }

  async confirmBankTransfer(paymentId: string, userId: string) {
    const payment = await this.getTenantPayment(paymentId, userId);

    if (payment.status === PaymentStatus.PAID) {
      throw new BadRequestException('Payment is already completed');
    }

    if (payment.status === PaymentStatus.PENDING_VERIFICATION) {
      throw new BadRequestException('Transfer already submitted for verification');
    }

    payment.status = PaymentStatus.PENDING_VERIFICATION;
    payment.paymentMethod = PaymentMethod.BANK_TRANSFER;
    payment.transactionRef =
      this.paystackService.buildTransferReference(payment.id);

    const saved = await this.paymentRepo.save(payment);

    void this.notificationsService.sendTransferPendingVerification({
      landlordEmail: payment.tenant.landlord.email,
      landlordName: payment.tenant.landlord.fullName,
      tenantName: payment.tenant.name,
      amount: Number(payment.amount),
      reference: saved.transactionRef ?? '',
    });

    return saved;
  }

  async verifyBankTransfer(paymentId: string, landlordId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['tenant', 'tenant.user', 'tenant.landlord'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.tenant.landlord.id !== landlordId) {
      throw new ForbiddenException('Access denied');
    }

    if (payment.status !== PaymentStatus.PENDING_VERIFICATION) {
      throw new BadRequestException('Payment is not awaiting verification');
    }

    payment.status = PaymentStatus.PAID;
    payment.paidAt = new Date();
    payment.landlordSettled = false;

    const saved = await this.paymentRepo.save(payment);

    if (payment.tenant.user?.email) {
      void this.notificationsService.sendPaymentConfirmation({
        tenantEmail: payment.tenant.user.email,
        tenantName: payment.tenant.name,
        amount: Number(payment.amount),
        reference: payment.transactionRef ?? '',
      });
    }

    return saved;
  }

  async rejectBankTransfer(paymentId: string, landlordId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['tenant', 'tenant.landlord'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.tenant.landlord.id !== landlordId) {
      throw new ForbiddenException('Access denied');
    }

    if (payment.status !== PaymentStatus.PENDING_VERIFICATION) {
      throw new BadRequestException('Payment is not awaiting verification');
    }

    payment.status =
      new Date(payment.dueDate) < new Date()
        ? PaymentStatus.OVERDUE
        : PaymentStatus.PENDING;
    payment.paymentMethod = undefined;
    payment.transactionRef = undefined;

    return this.paymentRepo.save(payment);
  }

  async markAsPaid(paymentId: string, userId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
      relations: ['tenant', 'tenant.landlord', 'tenant.user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const isLandlord = payment.tenant.landlord.id === userId;

    if (!isLandlord) {
      throw new ForbiddenException(
        'Tenants must pay via Paystack or bank transfer',
      );
    }

    payment.status = PaymentStatus.PAID;
    payment.paymentMethod = PaymentMethod.BANK_TRANSFER;
    payment.paidAt = new Date();

    return this.paymentRepo.save(payment);
  }

  async findAll(userId: string) {
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

    for (const payment of payments) {
      if (
        payment.status === PaymentStatus.PENDING &&
        new Date(payment.dueDate) < new Date()
      ) {
        payment.status = PaymentStatus.OVERDUE;

        await this.paymentRepo.save(payment);
      }
    }

    return payments;
  }

  async findOne(paymentId: string, userId: string) {
    const payment = await this.paymentRepo.findOne({
      where: {
        id: paymentId,

        tenant: {
          landlord: {
            id: userId,
          },
        },
      },

      relations: ['tenant', 'tenant.landlord'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  getMyPayments(userId: string) {
    return this.paymentRepo.find({
      where: {
        tenant: {
          user: {
            id: userId,
          },
        },
      },
      relations: ['tenant', 'tenant.user'],
      order: { dueDate: 'DESC' },
    });
  }

  async remove(paymentId: string, userId: string) {
    const payment = await this.paymentRepo.findOne({
      where: {
        id: paymentId,

        tenant: {
          landlord: {
            id: userId,
          },
        },
      },

      relations: ['tenant', 'tenant.landlord'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.paymentRepo.remove(payment);

    return {
      message: 'Payment deleted successfully',
    };
  }

  @Cron('0 0 * * *')
  async handleOverduePayments() {
    const payments = await this.paymentRepo.find({
      where: {
        status: PaymentStatus.PENDING,
      },
    });

    for (const payment of payments) {
      if (new Date(payment.dueDate) < new Date()) {
        payment.status = PaymentStatus.OVERDUE;

        await this.paymentRepo.save(payment);
      }
    }
  }
}
