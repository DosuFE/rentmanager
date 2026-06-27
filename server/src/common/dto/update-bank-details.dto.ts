import { IsString, MinLength } from 'class-validator';

export class UpdateBankDetailsDto {
  @IsString()
  @MinLength(2)
  bankName: string;

  @IsString()
  @MinLength(10)
  accountNumber: string;

  @IsString()
  @MinLength(2)
  accountName: string;
}
