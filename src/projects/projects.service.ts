import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createProject(createProjectDto: CreateProjectDto, authenticatedUser?: User) {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (authenticatedUser.role !== 'Admin') {
      throw new UnauthorizedException(`Only administrators can create projects. Your role is ${authenticatedUser.role}`);
    }

    const referringEmployeeId = createProjectDto.referringEmployeeId;
    const referringEmployee = await this.userRepository.findOne({ where: { id: referringEmployeeId },});
    if (!referringEmployee) {
      throw new NotFoundException(`User with ID ${referringEmployeeId} not found`);
    }
    if (referringEmployee.role !== 'ProjectManager' && referringEmployee.role !== 'Admin') {
      throw new UnauthorizedException(`Referring employee with ID ${referringEmployeeId} must be a manager or admin`);
    }

    const project = this.projectsRepository.create({
      name: createProjectDto.name,
      referringEmployeeId: referringEmployeeId,
      referringEmployee: {
        id: referringEmployee.id,
        username: referringEmployee.username,
        email: referringEmployee.email,
        role: referringEmployee.role,
      },
    });
  
    await this.projectsRepository.save(project);
  
    return project;
  }
  

  async findAll(authenticatedUser?: User) {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Unauthorized');
    }
    return `This action returns all projects`;
  }

  async findOne(id: number, authenticatedUser?: User) {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Unauthorized');
    }
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}