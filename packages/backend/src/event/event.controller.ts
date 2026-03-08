import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDec } from '@/auth/decor-pass-user';
import { User } from '@prisma/client';
import { IEvent } from '@/gen-resp/interface/customResponces';


@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  //1.Loggened Users can create new account
   //Endpoint: Post /api/v1/event
   @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(['jwt-auth']))
  @Post()
  async createCompany(@UserDec() user: User, @Body() eventData: CreateEventDto): Promise<IEvent> {
      return this.eventService.create(user, eventData);
   }

  

}
