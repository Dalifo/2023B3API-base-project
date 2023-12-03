import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  
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
    public referringEmployee!: User;
  }
  