import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Event {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column({ type: 'timestamp' })
    public date!: Date;

    @Column({
        type: 'enum',
        enum: ['Pending', 'Accepted', 'Declined'],
        default: 'Pending',
    })
    public eventStatus?: string;

    @Column()
    public eventType!: 'RemoteWork' | 'PaidLeave';

    @Column({ nullable: true })
    public eventDescription?: string;

    @Column()
    public userId!: string;

    @ManyToOne(() => User, (user) => user.events, { eager: true })
    @JoinColumn({ name: 'userId' })
    public user!: User;
}
