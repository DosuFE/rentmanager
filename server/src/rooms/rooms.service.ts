import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '../entity/property.entity';
import { Room } from '../entity/room.entity';
import { Tenants } from '../entity/tenants.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from 'src/common/dto/create-room.dto';
import { UpdateRoomDto } from 'src/common/dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepo: Repository<Room>,

    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,

    @InjectRepository(Tenants)
    private tenantRepo: Repository<Tenants>,
  ) {}

  async create(dto: CreateRoomDto, userId: string) {
    const property = await this.propertyRepo.findOne({
      where: {
        id: dto.propertyId,

        landlord: {
          id: userId,
        },
      },

      relations: ['landlord'],
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const room = this.roomRepo.create({
      roomNumber: dto.roomNumber,
      floor: dto.floor,
      capacity: dto.capacity,
      property,
    });

    return this.roomRepo.save(room);
  }

  findAll(userId: string) {
    return this.roomRepo.find({
      where: {
        property: {
          landlord: {
            id: userId,
          },
        },
      },

      relations: ['property', 'property.landlord', 'tenants'],
    });
  }

  async findOne(roomId: string, userId: string) {
    const room = await this.roomRepo.findOne({
      where: {
        id: roomId,

        property: {
          landlord: {
            id: userId,
          },
        },
      },

      relations: ['property', 'tenants'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async update(roomId: string, dto: UpdateRoomDto, userId: string) {
    const room = await this.findOne(roomId, userId);

    Object.assign(room, dto);

    return this.roomRepo.save(room);
  }

  async remove(roomId: string, userId: string) {
    const room = await this.findOne(roomId, userId);

    return this.roomRepo.remove(room);
  }

  async assignTenant(roomId: string, tenantId: number, userId: string) {
    const room = await this.roomRepo.findOne({
      where: {
        id: roomId,

        property: {
          landlord: {
            id: userId,
          },
        },
      },

      relations: ['property', 'property.landlord'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const tenant = await this.tenantRepo.findOne({
      where: {
        id: tenantId,

        landlord: {
          id: userId,
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    tenant.room = room;

    room.isAvailable = false;

    await this.roomRepo.save(room);

    return this.tenantRepo.save(tenant);
  }

  findVacantRooms(userId: string) {
    return this.roomRepo.find({
      where: {
        isAvailable: true,

        property: {
          landlord: {
            id: userId,
          },
        },
      },

      relations: ['property'],
    });
  }

  findOccupiedRooms(userId: string) {
    return this.roomRepo.find({
      where: {
        isAvailable: false,

        property: {
          landlord: {
            id: userId,
          },
        },
      },

      relations: ['property', 'tenants'],
    });
  }

  async getPropertyStats(propertyId: string, userId: string) {
    const property = await this.propertyRepo.findOne({
      where: {
        id: propertyId,

        landlord: {
          id: userId,
        },
      },

      relations: ['rooms'],
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const totalRooms = property.rooms.length;

    const occupiedRooms = property.rooms.filter(
      (room) => !room.isAvailable,
    ).length;

    const vacantRooms = totalRooms - occupiedRooms;

    return {
      totalRooms,
      occupiedRooms,
      vacantRooms,
    };
  }
}
