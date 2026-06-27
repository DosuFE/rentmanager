import { IsDateString, IsNumber, IsInt } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount!: number;

  @IsDateString()
  dueDate!: string;

  @IsInt()
  tenantId!: number;
}
