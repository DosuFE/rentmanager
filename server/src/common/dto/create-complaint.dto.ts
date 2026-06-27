import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ComplaintCategory } from '../enums/complaint.enum';

export class CreateComplaintDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsEnum(ComplaintCategory)
  category?: ComplaintCategory;
}
