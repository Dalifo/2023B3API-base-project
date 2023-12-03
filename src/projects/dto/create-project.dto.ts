import { IsNotEmpty, Length, IsUUID, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @Length(3)
  name!: string;

  @IsOptional()
  description?: string;

  @IsUUID('4')
  referringEmployeeId: string;
}
