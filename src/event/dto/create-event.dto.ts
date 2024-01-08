import { Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateEventDto {
    @IsDateString()
    @IsNotEmpty()
    public date!: Date;

    @IsOptional()
    public eventStatus?: string;

    @Column()
    @IsNotEmpty()
    public eventType!: 'RemoteWork' | 'PaidLeave';

    @IsOptional()
    public eventDescription?: string;

    @Column()
    @IsNotEmpty()
    public userId!: string;

    @ManyToOne(() => User, (user) => user.events, { eager: true })
    @JoinColumn({ name: 'userId' })
    public user!: User;
}
