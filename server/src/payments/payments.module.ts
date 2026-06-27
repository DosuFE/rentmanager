import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../entity/payment.entity';
import { Tenants } from '../entity/tenants.entity';
import { User } from '../entity/users.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaystackModule } from '../paystack/paystack.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Tenants, User]),
    PaystackModule,
    NotificationsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
