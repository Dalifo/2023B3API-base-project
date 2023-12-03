import { Injectable } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';

@Injectable()
export class ProjectUsersService {
  create(createProjectUserDto: CreateProjectUserDto) {
    return 'This action adds a new projectUser';
  }

  findAll() {
    return `This action returns all projectUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} projectUser`;
  }

  update(id: number, updateProjectUserDto: UpdateProjectUserDto) {
    return `This action updates a #${id} projectUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectUser`;
  }
}
