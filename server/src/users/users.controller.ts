import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UpdateBankDetailsDto } from '../common/dto/update-bank-details.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('bank-details')
  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getBankDetails(@Req() req: any) {
    return this.usersService.getBankDetails(req.user.userId);
  }

  @Patch('bank-details')
  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateBankDetails(@Req() req: any, @Body() dto: UpdateBankDetailsDto) {
    return this.usersService.updateBankDetails(req.user.userId, dto);
  }
}
