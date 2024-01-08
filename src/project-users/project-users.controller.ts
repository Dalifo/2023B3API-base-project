import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';
import { AuthGuard } from '../users/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';

type RequestWithUser = {
  user: User;
};

@Controller('project-users')
@UseGuards(AuthGuard)
export class ProjectUsersController {
  constructor(private readonly projectUsersService: ProjectUsersService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createProjectUserDto: CreateProjectUserDto, @Req() req: RequestWithUser) {
    return this.projectUsersService.create(createProjectUserDto, req.user);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.projectUsersService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.projectUsersService.findOne(id, req.user);
  }  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectUserDto: UpdateProjectUserDto) {
    return this.projectUsersService.update(+id, updateProjectUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectUsersService.remove(+id);
  }
}
