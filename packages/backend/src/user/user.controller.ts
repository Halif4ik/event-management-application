import {Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {User} from "@prisma/client";

@Controller('user')
export class UserController {
   constructor(private readonly userService: UserService) {
   }

   //1.All Users can create new account
   //Endpoint: Post /api/v1/user/register
   @Post('register')
   @HttpCode(200)
   @ApiOperation({summary: 'Created User in database'})
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
      return this.userService.createUser(createUserDto);
   }

   //2.All Users with email can approve email
   //3. Users with email can approve pin code
   //Endpoint: Post /api/v1/user/verify-pin

}
