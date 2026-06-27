import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreatePropertyDto } from 'src/common/dto/create-property.dto';
import { UpdatePropertyDto } from 'src/common/dto/update-property.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly service: PropertiesService) {}

  @Post()
  @Roles('LANDLORD')
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreatePropertyDto, @Req() req: any) {
    return this.service.create(dto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Req() req: any,
  ) {
    return this.service.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Body() dto: UpdatePropertyDto,

    @Req() req: any,
  ) {
    return this.service.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Req() req: any,
  ) {
    return this.service.remove(id, req.user.userId);
  }
}
