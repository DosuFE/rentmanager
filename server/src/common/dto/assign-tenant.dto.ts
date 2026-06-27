import { IsInt } from 'class-validator';

export class AssignTenantDto {
  @IsInt()
  tenantId: number;
}