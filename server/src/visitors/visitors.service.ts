import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVisitorDto } from '../common/dto/create-visitor.dto';
import { VisitorStatus } from '../common/enums/visitor.enum';
import { Tenants } from '../entity/tenants.entity';
import { Visitor } from '../entity/visitor.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private visitorRepo: Repository<Visitor>,

    @InjectRepository(Tenants)
    private tenantRepo: Repository<Tenants>,

    private notificationsService: NotificationsService,
  ) {}

  private async getTenantByUserId(userId: string) {
    const tenant = await this.tenantRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'landlord', 'room', 'room.property'],
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return tenant;
  }

  async create(dto: CreateVisitorDto, userId: string) {
    const tenant = await this.getTenantByUserId(userId);

    const visitor = this.visitorRepo.create({
      visitorName: dto.visitorName,
      visitorPhone: dto.visitorPhone,
      visitDate: new Date(dto.visitDate),
      expectedArrival: dto.expectedArrival,
      purpose: dto.purpose,
      notes: dto.notes,
      tenant,
      status: VisitorStatus.PENDING,
    });

    const saved = await this.visitorRepo.save(visitor);

    const result = await this.visitorRepo.findOne({
      where: { id: saved.id },
      relations: [
        'tenant',
        'tenant.user',
        'tenant.landlord',
        'tenant.room',
        'tenant.room.property',
      ],
    });

    if (result?.tenant?.landlord?.email) {
      void this.notificationsService.sendVisitorRegistered({
        landlordEmail: result.tenant.landlord.email,
        tenantName: result.tenant.name,
        visitorName: result.visitorName,
        visitDate: result.visitDate.toLocaleDateString(),
        purpose: result.purpose,
        roomNumber: result.tenant.room?.roomNumber,
      });
    }

    return result;
  }

  findMyVisitors(userId: string) {
    return this.visitorRepo.find({
      where: {
        tenant: {
          user: { id: userId },
        },
      },
      relations: ['tenant', 'tenant.room', 'tenant.room.property'],
      order: { visitDate: 'DESC' },
    });
  }

  findAllForLandlord(landlordId: string) {
    return this.visitorRepo.find({
      where: {
        tenant: {
          landlord: { id: landlordId },
        },
      },
      relations: [
        'tenant',
        'tenant.user',
        'tenant.room',
        'tenant.room.property',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async acknowledge(visitorId: string, landlordId: string) {
    const visitor = await this.visitorRepo.findOne({
      where: { id: visitorId },
      relations: ['tenant', 'tenant.landlord', 'tenant.user', 'tenant.room'],
    });

    if (!visitor) {
      throw new NotFoundException('Visitor notification not found');
    }

    if (visitor.tenant.landlord.id !== landlordId) {
      throw new ForbiddenException('Access denied');
    }

    visitor.status = VisitorStatus.ACKNOWLEDGED;

    return this.visitorRepo.save(visitor);
  }
}
