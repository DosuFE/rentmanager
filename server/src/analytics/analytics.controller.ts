import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { AnalyticsService } from './analytics.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('payments')
  getPaymentAnalytics(@Req() req: any) {
    return this.analyticsService.getPaymentAnalytics(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboardStats(@Req() req: any) {
    return this.analyticsService.getDashboardStats(req.user.userId);
  }
}
