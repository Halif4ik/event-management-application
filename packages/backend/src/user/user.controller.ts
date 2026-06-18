import {Controller, Get, Post, Body, UsePipes, ValidationPipe, HttpCode, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiBearerAuth, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {User} from "@prisma/client";
import { UserResponseClass, UserExistResponseClass } from './dto/responce-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserDec } from '@/auth/decor-pass-user';
import { IEvent } from '@/gen-resp/interface/customResponces';
import { EventService } from '@/event/event.service';

@Controller('user')
export class UserController {
   constructor(private readonly userService: UserService, private readonly eventService: EventService) {
   }

   //1.All Users can create new account
   //Endpoint: Post /api/v1/user/register
   @Post('register')
   @HttpCode(200)
   @ApiOkResponse({
    description: "User created successfully",
    type: UserResponseClass
  })
  @ApiBadRequestResponse({
    description: "User already exist in db",
    type: UserExistResponseClass
  })

   @ApiOperation({summary: 'Created User in database'})
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
      return this.userService.createUser(createUserDto);
   }

   // 2. Get user's events for calendar view
   // Endpoint: GET /api/v1/user/me/events
   @Get('me/events')
   @HttpCode(200)
   @ApiOperation({summary: 'Get user events for calendar (organizer or participant)'})
   @ApiBearerAuth()
   @ApiOkResponse({description: 'List of user events retrieved successfully'})
   @ApiUnauthorizedResponse({description: 'Unauthorized - JWT token required'})
   @UseGuards(AuthGuard(['jwt-auth']))
   async getMyEvents(@UserDec() user: User): Promise<IEvent> {
      return this.eventService.getMyEvents(user);
   }

}
