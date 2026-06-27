import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.fromEmail =
      this.configService.get<string>('EMAIL_FROM') ?? 'onboarding@resend.dev';
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    if (!this.resend) {
      this.logger.warn(
        `RESEND_API_KEY not set — skipping email to ${to}: ${subject}`,
      );
      return;
    }

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${subject}`, error);
    }
  }

  async sendRentReminder(email: string) {
    return this.sendEmail(
      email,
      'Rent Due Reminder',
      `
        <h1>Rent Reminder</h1>
        <p>Your rent is due tomorrow.</p>
      `,
    );
  }

  async sendVisitorRegistered(params: {
    landlordEmail: string;
    tenantName: string;
    visitorName: string;
    visitDate: string;
    purpose?: string;
    roomNumber?: string;
  }) {
    const { landlordEmail, tenantName, visitorName, visitDate, purpose, roomNumber } =
      params;

    return this.sendEmail(
      landlordEmail,
      `Visitor notification from ${tenantName}`,
      `
        <h1>New visitor notification</h1>
        <p><strong>${tenantName}</strong> has registered an expected visitor.</p>
        <ul>
          <li><strong>Visitor:</strong> ${visitorName}</li>
          <li><strong>Visit date:</strong> ${visitDate}</li>
          ${roomNumber ? `<li><strong>Room:</strong> ${roomNumber}</li>` : ''}
          ${purpose ? `<li><strong>Purpose:</strong> ${purpose}</li>` : ''}
        </ul>
        <p>Sign in to your landlord dashboard to review and acknowledge this notification.</p>
      `,
    );
  }

  async sendComplaintFeedback(params: {
    tenantEmail: string;
    tenantName: string;
    complaintTitle: string;
    feedback: string;
    status: string;
  }) {
    const { tenantEmail, tenantName, complaintTitle, feedback, status } = params;

    return this.sendEmail(
      tenantEmail,
      `Feedback on your complaint: ${complaintTitle}`,
      `
        <h1>Complaint feedback</h1>
        <p>Hello ${tenantName},</p>
        <p>Your landlord has responded to your complaint <strong>"${complaintTitle}"</strong>.</p>
        <p><strong>Status:</strong> ${status.replace('_', ' ')}</p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 12px; margin: 16px 0;">
          ${feedback}
        </blockquote>
        <p>Sign in to your tenant portal to view the full details.</p>
      `,
    );
  }

  async sendPaymentReceived(params: {
    landlordEmail: string;
    landlordName: string;
    tenantName: string;
    amount: number;
    reference: string;
    method: string;
  }) {
    const { landlordEmail, landlordName, tenantName, amount, reference, method } =
      params;

    return this.sendEmail(
      landlordEmail,
      `Rent payment received from ${tenantName}`,
      `
        <h1>Payment received</h1>
        <p>Hello ${landlordName},</p>
        <p><strong>${tenantName}</strong> has paid <strong>₦${amount.toLocaleString()}</strong> via ${method}.</p>
        <p><strong>Reference:</strong> ${reference}</p>
        <p>Funds are held on the platform pending settlement to your account.</p>
      `,
    );
  }

  async sendPaymentConfirmation(params: {
    tenantEmail: string;
    tenantName: string;
    amount: number;
    reference: string;
  }) {
    const { tenantEmail, tenantName, amount, reference } = params;

    return this.sendEmail(
      tenantEmail,
      'Rent payment confirmed',
      `
        <h1>Payment confirmed</h1>
        <p>Hello ${tenantName},</p>
        <p>Your rent payment of <strong>₦${amount.toLocaleString()}</strong> has been confirmed.</p>
        <p><strong>Reference:</strong> ${reference}</p>
        <p>Thank you for your payment.</p>
      `,
    );
  }

  async sendTransferPendingVerification(params: {
    landlordEmail: string;
    landlordName: string;
    tenantName: string;
    amount: number;
    reference: string;
  }) {
    const { landlordEmail, landlordName, tenantName, amount, reference } =
      params;

    return this.sendEmail(
      landlordEmail,
      `Bank transfer to verify from ${tenantName}`,
      `
        <h1>Transfer awaiting verification</h1>
        <p>Hello ${landlordName},</p>
        <p><strong>${tenantName}</strong> says they transferred <strong>₦${amount.toLocaleString()}</strong>.</p>
        <p><strong>Reference:</strong> ${reference}</p>
        <p>Please check your bank account and confirm or reject in your payments dashboard.</p>
      `,
    );
  }
}
