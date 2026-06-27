import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entity/payment.entity';
import { Property } from 'src/entity/property.entity';
import { Room } from 'src/entity/room.entity';
import { Tenants } from 'src/entity/tenants.entity';
import { User } from 'src/entity/users.entity';
import { Visitor } from 'src/entity/visitor.entity';
import { Complaint } from 'src/entity/complaint.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL')?.replace(/;$/, ''),
        autoLoadEntities: true,
        synchronize: true,
        entities: [User, Tenants, Payment, Property, Room, Visitor, Complaint],
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
