import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';

@Controller('project-users')
export class ProjectUsersController {
  constructor(private readonly projectUsersService: ProjectUsersService) {}

  @Post()
  create(@Body() createProjectUserDto: CreateProjectUserDto) {
    return this.projectUsersService.create(createProjectUserDto);
  }

  @Get()
  findAll() {
    return this.projectUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectUsersService.findOne(+id);
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
