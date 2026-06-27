import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { TenantsModule } from './tenants/tenants.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { RoomsModule } from './rooms/rooms.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsModule } from './notifications/notifications.module';
import { VisitorsModule } from './visitors/visitors.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TenantsModule,
    PaymentsModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    RoomsModule,
    AnalyticsModule,
    NotificationsModule,
    VisitorsModule,
    ComplaintsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, NotificationsController],
  providers: [AppService],
})
export class AppModule {}
