import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ProjectUser } from './entities/project-user.entity';

@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ProjectUser)
    private projectUserRepository: Repository<ProjectUser>,
  ) {}

  async create(createProjectUserDto: CreateProjectUserDto, authenticatedUser?: User): Promise<ProjectUser> {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (authenticatedUser.role === 'Employee') {
      throw new UnauthorizedException(`${authenticatedUser.role} can't affect mployees to a project`);
    }

    const projectId = createProjectUserDto.projectId;
    const project = await this.projectsRepository.findOne({ where: { id: projectId },});
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    
    const userId = createProjectUserDto.userId;
    const user = await this.userRepository.findOne({ where: { id: userId },});
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const overlappingProjectUser = await this.projectUserRepository.findOne({
      where: {
        userId: userId,
        startDate: LessThanOrEqual(createProjectUserDto.endDate),
        endDate: MoreThanOrEqual(createProjectUserDto.startDate),
      },
    });

    if (overlappingProjectUser) {
      throw new ConflictException(`User with ID ${userId} is already assigned to another project for the requested period`);
    }

    const projectUser = this.projectUserRepository.create({
      startDate: createProjectUserDto.startDate,
      endDate: createProjectUserDto.endDate,
      userId: userId,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      projectId: projectId,
      project: {
        id: project.id,
        name: project.name,
        referringEmployeeId: project.referringEmployeeId,
        referringEmployee: {
          id: project.referringEmployee.id,
          username: project.referringEmployee.username,
          email: project.referringEmployee.email,
          role: project.referringEmployee.role
        }
      }
    });
    

    await this.projectUserRepository.save(projectUser)

    return projectUser;
  }

  async findAll(authenticatedUser?: User): Promise<{ id: string, name: string, referringEmployeeId: string }[]> {
    let projectUsers: ProjectUser[];
  
    if (!authenticatedUser) {
      throw new UnauthorizedException('Unauthorized');
    }
  
    if (authenticatedUser.role === 'Admin' || authenticatedUser.role === 'ProjectManager') {
      projectUsers = await this.projectUserRepository.find({
        relations: ['project', 'user'],
      });
    } else {
      projectUsers = await this.projectUserRepository.find({
        where: { id: authenticatedUser.id },
        relations: ['project', 'user'],
      });
    }
  
    const result = projectUsers.map(({ id, project }) => ({
      id,
      name: project.name,
      referringEmployeeId: project.referringEmployeeId,
    }));
  
    return result;
  }
  

  async findOne(id: string, authenticatedUser?: User): Promise<ProjectUser> {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Unauthorized');
    }
  
    try {
      const projectUser = await this.projectUserRepository.findOneOrFail({
        where: { id: id },
        relations: ['project', 'user'],
      });
  
      if (projectUser.user.id !== authenticatedUser.id && authenticatedUser.role === 'Employee') {
        throw new NotFoundException('ProjectUser not found');
      }
  
      const partialProjectUser: DeepPartial<ProjectUser> = {
        id: projectUser.id,
        startDate: projectUser.startDate,
        endDate: projectUser.endDate,
        projectId: projectUser.projectId,
        userId: projectUser.userId,
      };
  
      return partialProjectUser as ProjectUser;
    } catch (error) {
      throw new NotFoundException('ProjectUser not found');
    }
  }
  

  update(id: number, updateProjectUserDto: UpdateProjectUserDto) {
    return `This action updates a #${id} projectUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectUser`;
  }
}
