import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseGuards, HttpCode, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventFilterDto } from './dto/event-filter.dto';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDec } from '@/auth/decor-pass-user';
import { User } from '@prisma/client';
import { IEvent } from '@/gen-resp/interface/customResponces';
import { ApiOperation, ApiBearerAuth, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiConflictResponse } from '@nestjs/swagger';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all public events' })
  @ApiOkResponse({ description: 'List of events retrieved successfully' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async findAll(@Query() filter: EventFilterDto): Promise<IEvent> {
    return this.eventService.findAll(filter);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiOkResponse({ description: 'Event retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  async findOne(@Param('id') id: string): Promise<IEvent> {
    return this.eventService.findOne(id);
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create new event' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Event created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - JWT token required' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(AuthGuard(['jwt-auth']))
  async createEvent(@UserDec() user: User, @Body() eventData: CreateEventDto): Promise<IEvent> {
    return this.eventService.create(user, eventData);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update event (organizer only)' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Event updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - JWT token required' })
  @ApiForbiddenResponse({ description: 'Only organizer can update this event' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(AuthGuard(['jwt-auth']))
  async updateEvent(
    @UserDec() user: User,
    @Param('id') id: string,
    @Body() updateData: UpdateEventDto,
  ): Promise<IEvent> {
    return this.eventService.update(user, id, updateData);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete event (organizer only)' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Event deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - JWT token required' })
  @ApiForbiddenResponse({ description: 'Only organizer can delete this event' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @UseGuards(AuthGuard(['jwt-auth']))
  async deleteEvent(@UserDec() user: User, @Param('id') id: string): Promise<{ message: string }> {
    return this.eventService.remove(user, id);
  }

  @Post(':id/join')
  @HttpCode(200)
  @ApiOperation({ summary: 'Join an event' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully joined the event' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - JWT token required' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiConflictResponse({ description: 'Already joined or event is full' })
  @UseGuards(AuthGuard(['jwt-auth']))
  async joinEvent(@UserDec() user: User, @Param('id') id: string): Promise<IEvent> {
    return this.eventService.joinEvent(user, id);
  }

  @Post(':id/leave')
  @HttpCode(200)
  @ApiOperation({ summary: 'Leave an event' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully left the event' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - JWT token required' })
  @ApiNotFoundResponse({ description: 'Event not found' })
  @ApiConflictResponse({ description: 'Not a participant of this event' })
  @UseGuards(AuthGuard(['jwt-auth']))
  async leaveEvent(@UserDec() user: User, @Param('id') id: string): Promise<IEvent> {
    return this.eventService.leaveEvent(user, id);
  }

  @Get('my/events')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get my events (organizer or participant)' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'List of user events retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - JWT token required' })
  @UseGuards(AuthGuard(['jwt-auth']))
  async getMyEvents(@UserDec() user: User): Promise<IEvent> {
    return this.eventService.getMyEvents(user);
  }
}
