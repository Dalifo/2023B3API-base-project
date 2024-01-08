import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from '../users/entities/user.entity';
import { Event } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ValidationActionDto } from './dto/validation-action.dto';
import { Project } from '../projects/entities/project.entity';
import { ProjectUser } from '../project-users/entities/project-user.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
  ) {}

  async createEvent(createEventDto: CreateEventDto, authenticatedUser?: User): Promise<Event> {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Unauthorized');
    }
  
    const { date, eventDescription, eventType } = createEventDto;

    const dateObj = new Date(date);

    const existingEvent = await this.eventRepository.findOne({
      where: { date: dateObj, userId: authenticatedUser.id },
    });
  
    if (existingEvent) {
      throw new UnauthorizedException('An event already exists for the same day');
    }

    if (eventType === 'RemoteWork') {
      const startOfWeek = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate() - dateObj.getDay());
      const endOfWeek = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate() - dateObj.getDay() + 6);
    
      const remoteWorkCount = await this.eventRepository.count({
        where: {
          userId: authenticatedUser.id,
          eventType: 'RemoteWork',
          date: Between(startOfWeek, endOfWeek),
        },
      });
    
      if (remoteWorkCount >= 2) {
        throw new UnauthorizedException('Cannot have more than two RemoteWork events in the same week');
      }

      const event = this.eventRepository.create({
        date,
        eventDescription,
        eventType,
        userId: authenticatedUser.id,
      });
    
      await this.eventRepository.save(event);
    
      return event;
    }
    const event = this.eventRepository.create({
      date,
      eventDescription,
      eventType,
      userId: authenticatedUser.id,
      eventStatus: 'Pending',
    });

    await this.eventRepository.save(event);

    return event;
  }

  

  async findAll(authenticatedUser?: User): Promise<Event[]> {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Unauthorized');
    }
  
    const events = await this.eventRepository.find();
  
    return events;
  }
  
  

  async findOne(id: string, authenticatedUser?: User): Promise<Event> {
    if (!authenticatedUser) {
      throw new NotFoundException('User not found');
    }
  
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .select(['event.id', 'event.date', 'event.eventStatus', 'event.eventType', 'event.eventDescription', 'event.userId'])
      .where('event.id = :id', { id })
      .getOne();
  
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  
    return event;
  }
  
  

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  async isUserAttachedToProjectOnDate(userId: string, eventDate: Date): Promise<boolean> {
    
    const userProjects = await this.projectUserRepository.createQueryBuilder('projectUser')
      .where('projectUser.userId = :userId', { userId })
      .andWhere(':eventDate BETWEEN projectUser.startDate AND projectUser.endDate', { eventDate })
      .getMany();

  
    return userProjects.length > 0;
  }
  
  async isProjectManagerReferent(managerId: string, eventDate: Date, userId: string): Promise<boolean> {
    
    const projectUsers = await this.projectUserRepository
      .createQueryBuilder('projectUser')
      .leftJoinAndSelect('projectUser.project', 'project')
      .where(':eventDate BETWEEN projectUser.startDate AND projectUser.endDate', { eventDate })
      .andWhere('projectUser.userId = :userId', { userId })
      .getMany();


  
    const projects = projectUsers
      .filter((projectUser) => projectUser.project && projectUser.project.referringEmployeeId === managerId)
      .map((projectUser) => projectUser.project);
    
    return projects.length > 0;
  }

  
  async validate(id: string, validationActionDto: ValidationActionDto, authenticatedUser: User): Promise<Event> {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (authenticatedUser.role === 'Employee') {
      throw new UnauthorizedException('Unauthorized');
    }
  
    const event = await this.eventRepository.findOne({
      where: { id: id },
    });
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  
    if (event.eventStatus === 'Accepted' || event.eventStatus === 'Declined') {
      throw new UnauthorizedException('Event already validated or declined');
    }
  
    if (authenticatedUser.role !== "Admin"){
      const isUserAttachedToProject = await this.isUserAttachedToProjectOnDate(event.userId, event.date);

      if (!isUserAttachedToProject) {
      throw new UnauthorizedException('User not attached to a project on the event date');
    }
    }
  
    if (authenticatedUser.role === 'ProjectManager') {
      const isProjectManagerReferent = await this.isProjectManagerReferent(authenticatedUser.id, event.date, event.userId);
  
      if (!isProjectManagerReferent) {
        throw new UnauthorizedException('User not a project manager referent for the project on the event date');
      }
    }
  
    event.eventStatus = 'Accepted';
    
    await this.eventRepository.save(event);  
    return event;
  }
  
  async declineEvent(id: string, validationActionDto: ValidationActionDto, authenticatedUser: User): Promise<Event> {
    if (!authenticatedUser) {
      throw new UnauthorizedException('Unauthorized');
    }
    
    if (authenticatedUser.role === 'Employee') {
      throw new UnauthorizedException('Unauthorized');
    }
  
    const event = await this.eventRepository.findOne({
      where: { id: id },
    });
  
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  
    if (event.eventStatus === 'Accepted' || event.eventStatus === 'Declined') {
      throw new UnauthorizedException('Event already validated or declined');
    }
  
    if (authenticatedUser.role === 'Admin') {
      const isUserAttachedToProject = await this.isUserAttachedToProjectOnDate(event.userId, event.date);
      
      if (!isUserAttachedToProject) {
        throw new UnauthorizedException('User not attached to a project on the event date');
      }
    }
  
    if (authenticatedUser.role === 'ProjectManager') {
      const isProjectManagerReferent = await this.isProjectManagerReferent(authenticatedUser.id, event.date, event.userId);
  
      if (!isProjectManagerReferent) {
        throw new UnauthorizedException('User not a project manager referent for the project on the event date');
      }
    }
  
    event.eventStatus = 'Declined';
    await this.eventRepository.save(event);
  
    return event;
  }
  


  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
