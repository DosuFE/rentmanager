import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ComplaintStatus } from '../enums/complaint.enum';

export class ComplaintFeedbackDto {
  @IsString()
  @MinLength(5)
  landlordFeedback: string;

  @IsOptional()
  @IsEnum(ComplaintStatus)
  status?: ComplaintStatus;
}
