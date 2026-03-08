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
import {VereficationUserDto} from "@/user/dto/verefication-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //1.Registered users can home in system
  //Endpoint: Post /api/v1/auth/login
  @Post('login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() loginDto: VereficationUserDto): Promise<TResponseAuth> {
    return this.authService.login(loginDto);
  }

  //2.Registered users can LOGout from system
  //Endpoint: Post /api/v1/auth/logout
  @UsePipes(ValidationPipe)
  @Get("logout")
  @UseGuards(AuthGuard(['jwt-auth']))
  async userInfo(@UserDec() userFromGuard: User): Promise<Auth> {
    return this.authService.userLogout(userFromGuard);
  }
}
