import { Module } from '@nestjs/common';
import { NotificationService } from './notificationService';
import { NotificationController } from './notification.controller';
import {ConfigModule} from "@nestjs/config";

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [ConfigModule],
  exports: [NotificationService]
})
export class NotificationModule {}
