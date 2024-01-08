import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './events.service';
import { EventController } from './events.controller';
import { Event } from './entities/event.entity';
import { JwtModule } from '@nestjs/jwt';
import { Project } from '../projects/entities/project.entity';
import { ProjectUser } from '../project-users/entities/project-user.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Event, Project, User, ProjectUser])
  ], 
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
