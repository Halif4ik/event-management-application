import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {Auth, User} from "@prisma/client";
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "@/auth/decor-pass-user";
import {TResponseAuth} from "@/auth/interface/customResponces";
import {LoginUserDto} from "@/auth/dto/login-auth.dto";
import {ApiOperation, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse} from '@nestjs/swagger';
import { CorrectUserCredentials, IncorrectUserCredentials } from '@/user/dto/responce-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //1.Registered users can home in system
  //Endpoint: Post /api/v1/auth/login
  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({
      description: "User login successfully",
      type: CorrectUserCredentials  
   })
   @ApiBadRequestResponse({
      description: "Incorrect credentials",
      type: IncorrectUserCredentials
   })
   @ApiOperation({ summary: 'Login User' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() loginDto: LoginUserDto): Promise<TResponseAuth> {
    return this.authService.login(loginDto);
  }

  //2.Registered users can LOGout from system
  //Endpoint: Get /api/v1/auth/logout
  @Get("logout")
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout user from system' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'User logged out successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - JWT token required' })
  @UseGuards(AuthGuard(['jwt-auth']))
  async userInfo(@UserDec() userFromGuard: User): Promise<Auth> {
    return this.authService.userLogout(userFromGuard);
  }
}
