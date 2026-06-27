import { IsInt, IsNotEmpty, IsString, Min, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @IsInt()
  @Min(1)
  floor: number;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsUUID()
  propertyId: string;
}
