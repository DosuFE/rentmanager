import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../notifications/notifications.module';
import { Visitor } from '../entity/visitor.entity';
import { Tenants } from '../entity/tenants.entity';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Visitor, Tenants]),
    NotificationsModule,
  ],
  controllers: [VisitorsController],
  providers: [VisitorsService],
})
export class VisitorsModule {}
