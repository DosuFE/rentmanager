import { Injectable, NotFoundException } from '@nestjs/common';
import { Property } from '../entity/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from '../common/dto/create-property.dto';
import { UpdatePropertyDto } from '../common/dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private repo: Repository<Property>,
  ) {}

  async create(dto: CreatePropertyDto, userId: string) {
    const property = this.repo.create({
      ...dto,

      landlord: {
        id: userId,
      },
    });

    return this.repo.save(property);
  }

  findAll(userId: string) {
    return this.repo.find({
      where: {
        landlord: {
          id: userId,
        },
      },

      relations: ['landlord'],
    });
  }

  async findOne(propertyId: string, userId: string) {
    const property = await this.repo.findOne({
      where: {
        id: propertyId,

        landlord: {
          id: userId,
        },
      },

      relations: ['landlord'],
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async update(propertyId: string, dto: UpdatePropertyDto, userId: string) {
    const property = await this.findOne(propertyId, userId);

    Object.assign(property, dto);

    return this.repo.save(property);
  }

  async remove(propertyId: string, userId: string) {
    const property = await this.findOne(propertyId, userId);

    await this.repo.remove(property);

    return {
      message: 'Property deleted successfully',
    };
  }
}
