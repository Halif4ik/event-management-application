import {ApiProperty} from '@nestjs/swagger';
import {IsEmail} from 'class-validator';

export class CreateNotificationDto {
   @IsEmail()
   @ApiProperty({example: "temp1@gmail.com", description: 'Email example for recive email notification'})
   readonly user_email: string;
}
