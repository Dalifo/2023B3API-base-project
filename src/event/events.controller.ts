import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ValidationActionDto } from './dto/validation-action.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../users/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

type RequestWithUser = {
  user: User;
};

@Controller('events')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Req() req: RequestWithUser) {
    return this.eventService.createEvent(createEventDto, req.user);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.eventService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.eventService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Post(':id/validate')
  validate(@Param('id') id: string, @Body() validationActionDto: ValidationActionDto, @Req() req: RequestWithUser) {
    return this.eventService.validate(id, validationActionDto, req.user);
  }

  @Post(':id/decline')
  declineEvent(@Param('id') id: string, @Body() validationActionDto: ValidationActionDto, @Req() req: RequestWithUser) {
    return this.eventService.declineEvent(id, validationActionDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
