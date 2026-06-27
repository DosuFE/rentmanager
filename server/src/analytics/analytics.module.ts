import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyticsService } from './analytics.service';

import { AnalyticsController } from './analytics.controller';

import { Payment } from '../entity/payment.entity';

import { Property } from '../entity/property.entity';

import { Room } from '../entity/room.entity';

import { Tenants } from '../entity/tenants.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Property, Room, Tenants])],

  providers: [AnalyticsService],

  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
