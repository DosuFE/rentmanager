import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

import { Role } from '../common/enums/role.enum';

import { CreateTenantDto } from '../common/dto/create-tenant.dto';

import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly service: TenantsService) {}

  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreateTenantDto, @Req() req: any) {
    return this.service.create(dto, req.user.userId);
  }

  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.userId);
  }

  @Roles(Role.TENANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  getMyProfile(@Req() req: any) {
    return this.service.getMyProfile(req.user.userId);
  }

  @Roles(Role.TENANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('my-room')
  getMyRoom(@Req() req: any) {
    return this.service.getMyRoom(req.user.userId);
  }

  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Req() req: any, @Param('id') tenantId: number) {
    return this.service.findOne(Number(tenantId), req.user.userId);
  }
}
