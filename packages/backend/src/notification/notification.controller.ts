import {Controller, Get, Post, Body} from '@nestjs/common';
import {NotificationService} from './notificationService';
import {CreateNotificationDto} from './dto/create-notification.dto';

@Controller('notification')
export class NotificationController {
   constructor(private readonly notificationService: NotificationService) {
   }

   /*temp handle for testing sendgrid*/
   @Post()
   async create(@Body() createNotificationDto: CreateNotificationDto): Promise<number> {
      return this.notificationService.emailVerify(createNotificationDto.user_email);
   }
}