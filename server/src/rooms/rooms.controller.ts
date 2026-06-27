import {
  Body,
  Controller,
  Patch,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
  Get,
  Post,
  Delete,
} from '@nestjs/common';

import { RoomsService } from './rooms.service';

import { AssignTenantDto } from '../common/dto/assign-tenant.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRoomDto } from '../common/dto/create-room.dto';
import { UpdateRoomDto } from '../common/dto/update-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly service: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRoomDto, @Req() req: any) {
    return this.service.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('vacant')
  findVacantRooms(@Req() req: any) {
    return this.service.findVacantRooms(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('occupied')
  findOccupiedRooms(@Req() req: any) {
    return this.service.findOccupiedRooms(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    roomId: string,

    @Req() req: any,
  ) {
    return this.service.findOne(roomId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe)
    roomId: string,

    @Body()
    dto: UpdateRoomDto,

    @Req() req: any,
  ) {
    return this.service.update(roomId, dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe)
    roomId: string,

    @Req() req: any,
  ) {
    return this.service.remove(roomId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/assign-tenant')
  assignTenant(
    @Param('id', ParseUUIDPipe)
    roomId: string,

    @Body()
    dto: AssignTenantDto,

    @Req() req: any,
  ) {
    return this.service.assignTenant(roomId, dto.tenantId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('property/:id/stats')
  getPropertyStats(
    @Param('id', ParseUUIDPipe)
    propertyId: string,

    @Req() req: any,
  ) {
    return this.service.getPropertyStats(propertyId, req.user.userId);
  }
}
