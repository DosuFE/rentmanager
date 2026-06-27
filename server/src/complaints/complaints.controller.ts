import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ComplaintFeedbackDto } from '../common/dto/complaint-feedback.dto';
import { CreateComplaintDto } from '../common/dto/create-complaint.dto';
import { ComplaintsService } from './complaints.service';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly service: ComplaintsService) {}

  @Roles(Role.TENANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreateComplaintDto, @Req() req: any) {
    return this.service.create(dto, req.user.userId);
  }

  @Roles(Role.TENANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('my')
  findMyComplaints(@Req() req: any) {
    return this.service.findMyComplaints(req.user.userId);
  }

  @Roles(Role.TENANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('my/:id')
  findMyComplaint(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.service.findOneForTenant(id, req.user.userId);
  }

  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.service.findAllForLandlord(req.user.userId);
  }

  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/feedback')
  addFeedback(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ComplaintFeedbackDto,
    @Req() req: any,
  ) {
    return this.service.addFeedback(id, dto, req.user.userId);
  }
}
