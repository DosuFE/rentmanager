import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;
}
