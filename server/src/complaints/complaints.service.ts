import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplaintFeedbackDto } from '../common/dto/complaint-feedback.dto';
import { CreateComplaintDto } from '../common/dto/create-complaint.dto';
import {
  ComplaintCategory,
  ComplaintStatus,
} from '../common/enums/complaint.enum';
import { Complaint } from '../entity/complaint.entity';
import { Tenants } from '../entity/tenants.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintRepo: Repository<Complaint>,

    @InjectRepository(Tenants)
    private tenantRepo: Repository<Tenants>,

    private notificationsService: NotificationsService,
  ) {}

  private async getTenantByUserId(userId: string) {
    const tenant = await this.tenantRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'landlord'],
    });

    if (!tenant) {
      throw new NotFoundException('Tenant profile not found');
    }

    return tenant;
  }

  async create(dto: CreateComplaintDto, userId: string) {
    const tenant = await this.getTenantByUserId(userId);

    const complaint = this.complaintRepo.create({
      title: dto.title,
      description: dto.description,
      category: dto.category ?? ComplaintCategory.OTHER,
      tenant,
      status: ComplaintStatus.OPEN,
    });

    const saved = await this.complaintRepo.save(complaint);

    return this.complaintRepo.findOne({
      where: { id: saved.id },
      relations: ['tenant', 'tenant.user', 'tenant.room'],
    });
  }

  findMyComplaints(userId: string) {
    return this.complaintRepo.find({
      where: {
        tenant: {
          user: { id: userId },
        },
      },
      relations: ['tenant', 'tenant.room'],
      order: { createdAt: 'DESC' },
    });
  }

  findAllForLandlord(landlordId: string) {
    return this.complaintRepo.find({
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

  async addFeedback(
    complaintId: string,
    dto: ComplaintFeedbackDto,
    landlordId: string,
  ) {
    const complaint = await this.complaintRepo.findOne({
      where: { id: complaintId },
      relations: ['tenant', 'tenant.landlord', 'tenant.user', 'tenant.room'],
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    if (complaint.tenant.landlord.id !== landlordId) {
      throw new ForbiddenException('Access denied');
    }

    complaint.landlordFeedback = dto.landlordFeedback;
    complaint.feedbackAt = new Date();

    if (dto.status) {
      complaint.status = dto.status;
    } else if (complaint.status === ComplaintStatus.OPEN) {
      complaint.status = ComplaintStatus.IN_PROGRESS;
    }

    const saved = await this.complaintRepo.save(complaint);

    if (complaint.tenant.user?.email) {
      void this.notificationsService.sendComplaintFeedback({
        tenantEmail: complaint.tenant.user.email,
        tenantName: complaint.tenant.name,
        complaintTitle: complaint.title,
        feedback: dto.landlordFeedback,
        status: saved.status,
      });
    }

    return saved;
  }

  async findOneForTenant(complaintId: string, userId: string) {
    const complaint = await this.complaintRepo.findOne({
      where: {
        id: complaintId,
        tenant: { user: { id: userId } },
      },
      relations: ['tenant', 'tenant.room'],
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    return complaint;
  }
}
