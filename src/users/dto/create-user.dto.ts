import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, IsOptional, IsNotEmpty } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateUserDto {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;
    
    @ApiProperty({ type: 'string'})
    @IsNotEmpty()
    @Length(3)
    username!: string;

    @ApiProperty({ type: 'string'})
    @Length(8)
    password!: string;

    @ApiProperty({ type: 'string'})
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsOptional()
    role?: 'Employee' | 'Admin' | 'ProjectManager';
}


