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
import { CreateVisitorDto } from '../common/dto/create-visitor.dto';
import { VisitorsService } from './visitors.service';

@Controller('visitors')
export class VisitorsController {
  constructor(private readonly service: VisitorsService) {}

  @Roles(Role.TENANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreateVisitorDto, @Req() req: any) {
    return this.service.create(dto, req.user.userId);
  }

  @Roles(Role.TENANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('my')
  findMyVisitors(@Req() req: any) {
    return this.service.findMyVisitors(req.user.userId);
  }

  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.service.findAllForLandlord(req.user.userId);
  }

  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/acknowledge')
  acknowledge(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.service.acknowledge(id, req.user.userId);
  }
}
