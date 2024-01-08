import { IsNotEmpty } from 'class-validator';

export class ValidationActionDto {
  @IsNotEmpty()
  action: 'validate' | 'decline';
}
