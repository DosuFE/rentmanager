import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    paid_at: string;
    metadata?: {
      paymentId?: string;
    };
  };
}

@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly secretKey: string;
  private readonly clientUrl: string;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY') ?? '';
    this.clientUrl =
      this.configService.get<string>('CLIENT_URL') ?? 'http://localhost:3000';
  }

  buildReference(paymentId: string) {
    return `RENT-${paymentId}-${Date.now()}`;
  }

  buildTransferReference(paymentId: string) {
    return `RENT-${paymentId.slice(0, 8).toUpperCase()}`;
  }

  async initializeTransaction(params: {
    email: string;
    amount: number;
    reference: string;
    paymentId: string;
    tenantId: number;
    landlordId: string;
  }) {
    if (!this.secretKey) {
      throw new InternalServerErrorException('Paystack is not configured');
    }

    const callbackUrl = `${this.clientUrl}/tenant/my-payments?reference=${params.reference}`;

    const response = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: params.email,
          amount: Math.round(params.amount * 100),
          reference: params.reference,
          callback_url: callbackUrl,
          metadata: {
            paymentId: params.paymentId,
            tenantId: params.tenantId,
            landlordId: params.landlordId,
          },
        }),
      },
    );

    const result = (await response.json()) as PaystackInitializeResponse;

    if (!response.ok || !result.status) {
      this.logger.error('Paystack initialize failed', result);
      throw new BadRequestException(
        result.message ?? 'Unable to initialize payment',
      );
    }

    return result.data;
  }

  async verifyTransaction(reference: string) {
    if (!this.secretKey) {
      throw new InternalServerErrorException('Paystack is not configured');
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      },
    );

    const result = (await response.json()) as PaystackVerifyResponse;

    if (!response.ok || !result.status) {
      throw new BadRequestException(
        result.message ?? 'Unable to verify payment',
      );
    }

    return result.data;
  }

  verifyWebhookSignature(rawBody: Buffer, signature: string | undefined) {
    if (!this.secretKey || !signature) {
      return false;
    }

    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(rawBody)
      .digest('hex');

    return hash === signature;
  }
}
