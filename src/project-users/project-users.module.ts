import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUser } from './entities/project-user.entity';
import { ProjectUsersService } from './project-users.service';
import { ProjectUsersController } from './project-users.controller';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { AuthGuard } from '../users/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([ProjectUser, Project, User]),
    UsersModule,
    ProjectsModule,
  ],
  controllers: [ProjectUsersController],
  providers: [ProjectUsersService, AuthGuard],
  exports: [TypeOrmModule, UsersModule, ProjectsModule]
})
export class ProjectUsersModule {}
