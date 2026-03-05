import {Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {User} from "@prisma/client";
import {PinDto, VereficationUserDto} from "@/user/dto/verefication-user.dto";

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
   //Endpoint: Post /api/v1/user/verify-request
   @Post('verify-request')
   @HttpCode(200)
   @ApiOperation({summary: 'Request was sent to email'})
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   async verifyUser(@Body() vereficationUserDto: VereficationUserDto): Promise<string> {
      return this.userService.verefication(vereficationUserDto);
   }

   //3. Users with email can approve pin code
   //Endpoint: Post /api/v1/user/verify-pin
   @Post('verify-pin')
   @HttpCode(200)
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   async verifyPin(@Body() pinDto: PinDto): Promise<User> {
      return this.userService.verifyPin(pinDto);
   }

}
