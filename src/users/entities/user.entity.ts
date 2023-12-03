import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public username!: string;

  @Column()
  public email!: string;

  @Column()
  public password!: string;

  @Column({
    type: 'enum',
    enum: ['Employee', 'Admin', 'ProjectManager'],
    default: 'Employee',
  })
  public role!: string;

  @OneToMany(() => Project, (project) => project.referringEmployee)
  public projects?: Project[];
}
