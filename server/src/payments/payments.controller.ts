import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

import { PaymentsService } from './payments.service';
import { PaystackService } from '../paystack/paystack.service';
import { CreatePaymentDto } from 'src/common/dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UnauthorizedException } from '@nestjs/common';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paystackService: PaystackService,
  ) {}

  @Post('webhook/paystack')
  async paystackWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-paystack-signature') signature: string,
    @Body() body: any,
  ) {
    const rawBody = req.rawBody;

    if (
      !rawBody ||
      !this.paystackService.verifyWebhookSignature(rawBody, signature)
    ) {
      throw new UnauthorizedException('Invalid Paystack webhook signature');
    }

    return this.paymentsService.handlePaystackWebhook(body);
  }

  @Post('webhook')
  async paystackWebhookAlias(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-paystack-signature') signature: string,
    @Body() body: any,
  ) {
    return this.paystackWebhook(req, signature, body);
  }

  @Post()
  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreatePaymentDto, @Req() req: any) {
    return this.paymentsService.create(dto, req.user.userId);
  }

  @Get()
  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Req() req: any) {
    return this.paymentsService.findAll(req.user.userId);
  }

  @Get('my-payments')
  @Roles(Role.TENANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getMyPayments(@Req() req: any) {
    return this.paymentsService.getMyPayments(req.user.userId);
  }

  @Get('verify/:reference')
  @Roles(Role.TENANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  verifyPaystack(@Param('reference') reference: string, @Req() req: any) {
    return this.paymentsService.verifyPaystack(reference, req.user.userId);
  }

  @Post(':id/initialize')
  @Roles(Role.TENANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  initializePaystack(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.paymentsService.initializePaystack(id, req.user.userId);
  }

  @Get(':id/bank-details')
  @Roles(Role.TENANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getBankDetails(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.paymentsService.getBankTransferDetails(id, req.user.userId);
  }

  @Post(':id/confirm-transfer')
  @Roles(Role.TENANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  confirmTransfer(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.paymentsService.confirmBankTransfer(id, req.user.userId);
  }

  @Patch(':id/verify-transfer')
  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  verifyTransfer(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.paymentsService.verifyBankTransfer(id, req.user.userId);
  }

  @Patch(':id/reject-transfer')
  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  rejectTransfer(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.paymentsService.rejectBankTransfer(id, req.user.userId);
  }

  @Get(':id')
  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Req() req: any,
  ) {
    return this.paymentsService.findOne(id, req.user.userId);
  }

  @Patch(':id/pay')
  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  markAsPaid(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Req() req: any,
  ) {
    return this.paymentsService.markAsPaid(id, req.user.userId);
  }

  @Delete(':id')
  @Roles(Role.LANDLORD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Req() req: any,
  ) {
    return this.paymentsService.remove(id, req.user.userId);
  }
}
