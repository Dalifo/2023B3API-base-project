import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Project } from "../../projects/entities/project.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class ProjectUser {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    public startDate!: Date;

    @Column()
    public endDate!: Date;

    @Column()
    public projectId!: string;

    @ManyToOne(() => Project, (project) => project.projectUsers, { eager: true })
    @JoinColumn({ name: 'projectId' })
    public project!: Project;

    @Column()
    public userId!: string;

    @ManyToOne(() => User, (user) => user.projectUsers, { eager: true })
    @JoinColumn({ name: 'userId' })
    public user!: User;
}
