import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class LoginDto {
    @ApiProperty({ type: 'string'})
    @IsEmail()
    email: string;
  
    @ApiProperty({ type: 'string'})
    @Length(8)
    password: string;
  }