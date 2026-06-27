import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../notifications/notifications.module';
import { Complaint } from '../entity/complaint.entity';
import { Tenants } from '../entity/tenants.entity';
import { ComplaintsController } from './complaints.controller';
import { ComplaintsService } from './complaints.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Complaint, Tenants]),
    NotificationsModule,
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
})
export class ComplaintsModule {}
