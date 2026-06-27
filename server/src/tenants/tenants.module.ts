import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenants } from '../entity/tenants.entity';
import { Payment } from '../entity/payment.entity';
import { User } from '../entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenants, Payment, User])],
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule {}
