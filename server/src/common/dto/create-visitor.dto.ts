import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateVisitorDto {
  @IsString()
  @MinLength(2)
  visitorName: string;

  @IsOptional()
  @IsString()
  visitorPhone?: string;

  @IsDateString()
  visitDate: string;

  @IsOptional()
  @IsString()
  expectedArrival?: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
