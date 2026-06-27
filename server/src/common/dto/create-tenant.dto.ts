import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  fullName: string;

  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
