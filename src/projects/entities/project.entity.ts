import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
import { ProjectUser } from '../../project-users/entities/project-user.entity';
import { UserDto } from '../../users/dto/user.dto';
  
@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @Column()
  public referringEmployeeId!: string;

  @ManyToOne(() => User, (user) => user.projects, { eager: true })
  @JoinColumn({ name: 'referringEmployeeId' })
  public referringEmployee!: UserDto; // Utilisez le type UserDto au lieu de User

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.project)
  projectUsers?: ProjectUser[];
}
  