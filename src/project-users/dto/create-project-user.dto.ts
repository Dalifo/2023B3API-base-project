import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export class CreateProjectUserDto {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column()
    startDate!: Date;

    @Column()
    endDate!: Date;
    

    projectId!: string; //au format uuidv4

    userId!: string; //au format uuidv4

}
