import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenants } from '../entity/tenants.entity';
import { Property } from '../entity/property.entity';
import { Room } from '../entity/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Property, Tenants])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
