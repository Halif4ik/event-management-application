import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { IEvent } from '@/gen-resp/interface/customResponces';
import { User } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class EventService {
  private readonly logger: Logger = new Logger(EventService.name);

  constructor(private prisma: PrismaService) {}

  async create(user: User, eventData: CreateEventDto): Promise<IEvent> {
    const newEvent = await this.prisma.event.create({
      data: {
        ...eventData,
        organizerId: user.id, // Set the organizer to the current user
      },
      include: {
        organizer: true, // Include organizer in the response
        participants: true, // Include participants if needed
      },
    });
    
    // Remove password from organizer
    const { password, ...organizerWithoutPassword } = newEvent.organizer;
    const sanitizedEvent = {
      ...newEvent,
      organizer: organizerWithoutPassword,
    };
    
    this.logger.log(`Created new event- ${newEvent.title}`);
    
    return { event: sanitizedEvent };
  }
  
}
