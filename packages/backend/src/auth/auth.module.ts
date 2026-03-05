import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {ConfigModule} from "@nestjs/config";
import {UserModule} from "@/user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {PrismaService} from "@/prisma.service";
import {JwtStrategyAuth} from "@/auth/jwt.strategy";

@Module({
  controllers: [AuthController],
  providers: [AuthService,PrismaService,JwtStrategyAuth],
  imports:[
    UserModule,
    ConfigModule,
    JwtModule,PassportModule
  ],
  exports:[AuthService]
})
export class AuthModule {}
