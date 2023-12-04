import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { AuthGuard } from '../users/jwt-auth.guard'; 
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { ProjectUser } from '../project-users/entities/project-user.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Project, User, ProjectUser]), 
    UsersModule, 

  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, AuthGuard],
  exports: [TypeOrmModule, UsersModule]
})
export class ProjectsModule {}
