import { IsUUID, IsDateString } from 'class-validator';

export class CreateProjectUserDto {
    @IsDateString()
    public startDate!: Date;

    @IsDateString()
    public endDate!: Date;

    @IsUUID('4')
    public projectId!: string;

    @IsUUID('4')
    public userId!: string;
}

