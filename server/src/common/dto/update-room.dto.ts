import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  roomNumber?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  floor?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}
