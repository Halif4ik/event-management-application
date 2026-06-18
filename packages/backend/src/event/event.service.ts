import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventFilterDto } from './dto/event-filter.dto';
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
        organizerId: user.id,
      },
      include: {
        organizer: true,
        participants: true,
      },
    });
    
    const { password, ...organizerWithoutPassword } = newEvent.organizer;
    const sanitizedEvent = {
      ...newEvent,
      organizer: organizerWithoutPassword,
    };
    
    this.logger.log(`Created new event- ${newEvent.title}`);
    
    return { event: sanitizedEvent };
  }

  async findAll(filter: EventFilterDto): Promise<IEvent> {
    const where: any = {};
    
    if (filter.isPublic !== undefined) {
      where.isPublic = filter.isPublic;
    } else {
      where.isPublic = true;
    }

    if (filter.fromDate || filter.toDate) {
      where.dateTime = {};
      if (filter.fromDate) {
        where.dateTime.gte = new Date(filter.fromDate);
      }
      if (filter.toDate) {
        where.dateTime.lte = new Date(filter.toDate);
      }
    }


    const events = await this.prisma.event.findMany({
      where,
      include: {
        organizer: true,
        participants: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: {
        dateTime: 'asc',
      },
    });


    const sanitizedEvents = events.map(event => {
      const { password, ...organizerWithoutPassword } = event.organizer;
      return {
        ...event,
        organizer: organizerWithoutPassword,
      };
    });

    return { event: sanitizedEvents };
  }

  async findOne(id: string): Promise<IEvent> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: true,
        participants: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const { password, ...organizerWithoutPassword } = event.organizer;
    
    // Sanitize participant passwords
    const sanitizedParticipants = event.participants.map(participant => {
      const { password, ...userWithoutPassword } = participant.user;
      return {
        ...participant,
        user: userWithoutPassword,
      };
    });

    const sanitizedEvent = {
      ...event,
      organizer: organizerWithoutPassword,
      participants: sanitizedParticipants,
    };

    return { event: sanitizedEvent };
  }

  async update(user: User, id: string, updateData: UpdateEventDto): Promise<IEvent> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException('Only the organizer can edit this event');
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        organizer: true,
        participants: true,
      },
    });

    const { password, ...organizerWithoutPassword } = updatedEvent.organizer;
    const sanitizedEvent = {
      ...updatedEvent,
      organizer: organizerWithoutPassword,
    };

    this.logger.log(`Updated event- ${updatedEvent.title}`);

    return { event: sanitizedEvent };
  }

  async remove(user: User, id: string): Promise<{ message: string }> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException('Only the organizer can delete this event');
    }

    await this.prisma.event.delete({
      where: { id },
    });

    this.logger.log(`Deleted event- ${event.title}`);

    return { message: 'Event deleted successfully' };
  }

  async joinEvent(user: User, eventId: string): Promise<IEvent> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        organizer: true,
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });


    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if event is full
    if (event.capacity !== null && event._count.participants >= event.capacity) {
      throw new ConflictException('Event is full');
    }

    // Check if user already joined
    const existingParticipation = event.participants.find(p => p.userId === user.id);
    if (existingParticipation) {
      throw new ConflictException('You have already joined this event');
    }

    // Add user as participant
    const participant = await this.prisma.participant.create({
      data: {
        userId: user.id,
        eventId: eventId,
      },
    });


    // Update the event object with new participant count
    event._count.participants += 1;
    event.participants.push({
      ...participant,
      user: {}as User,
    });

    const { password, ...organizerWithoutPassword } = event.organizer;
    
    // Sanitize participant passwords
    const sanitizedParticipants = event.participants.map(participant => {
           return {
        ...participant,
        user: {},
      };
    });

    const sanitizedEvent = {
      ...event,
      organizer: organizerWithoutPassword,
      participants: sanitizedParticipants,
    };

    this.logger.log(`User ${user.id} joined event- ${event.title}`);

    return { event: sanitizedEvent };
  }

  
  async leaveEvent(user: User, eventId: string): Promise<IEvent> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        organizer: true,
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const participation = event.participants.find(p => p.userId === user.id);
    if (!participation) {
      throw new ConflictException('You are not a participant of this event');
    }

    await this.prisma.participant.delete({
      where: {
        id: participation.id,
      },
    });

    // Update the event object by removing the participant
    event._count.participants -= 1;
    event.participants = event.participants.filter(p => p.userId !== user.id);

    const { password, ...organizerWithoutPassword } = event.organizer;
    
    // Sanitize participant passwords
    const sanitizedParticipants = event.participants.map(participant => {
      return {
        ...participant,
        user: {},
      };
    });

    const sanitizedEvent = {
      ...event,
      organizer: organizerWithoutPassword,
      participants: sanitizedParticipants,
    };

    this.logger.log(`User ${user.id} left event- ${event.title}`);

    return { event: sanitizedEvent };
  }

  async getMyEvents(user: User): Promise<IEvent> {
    const event = await this.prisma.event.findMany({
      where: {
        OR: [
          { organizerId: user.id },
          {
            participants: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
      include: {
        organizer: true,
        participants: false,
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: {
        dateTime: 'asc',
      },
    });

    const sanitizedEvents = event.map(event => {
      const { password, ...organizerWithoutPassword } = event.organizer;
      return {
        ...event,
        organizer: organizerWithoutPassword,
      };
    });

    return { event: sanitizedEvents };
  }
  
}
