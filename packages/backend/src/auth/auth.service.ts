import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "@/user/user.service";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {PrismaService} from "@/prisma.service";
import {Auth, User} from "@prisma/client";
import {VereficationUserDto} from "@/user/dto/verefication-user.dto";
import * as bcrypt from "bcryptjs";
import {TJwtBody} from "@/gen-resp/interface/customResponces";
import {TResponseAuth} from "@/auth/interface/customResponces";

@Injectable()
export class AuthService {

   constructor(private userService: UserService, private jwtService: JwtService,
               private prisma: PrismaService, private readonly configService: ConfigService) {
   }

   async login(loginDto: VereficationUserDto): Promise<TResponseAuth> {
      // return one token
      const userFromBd: User = await this.userService.getUserByEmailWithAuth(loginDto.email);
      if (userFromBd.actived === false) new HttpException("User dosen't activated", HttpStatus.UNAUTHORIZED);
      await this.checkUserCredentials(userFromBd, loginDto);
      return this.switchLoginStatAuth(userFromBd);
   }

   private async checkUserCredentials(userFromBd: User | null, loginDto: VereficationUserDto): Promise<void> {
      if (!userFromBd) throw new UnauthorizedException({message: "Incorrect credentials"});
      const passwordCompare = await bcrypt.compare(loginDto.password, userFromBd.password);
      if (!passwordCompare) throw new UnauthorizedException({message: "Incorrect credentials"});
   }

   private async switchLoginStatAuth(userFromBd: User): Promise<TResponseAuth> {
      const jwtBody: TJwtBody = {
         uuid: userFromBd.id,
         email: userFromBd.email,
         userName: userFromBd.fullName,
      }
      const accessToken: string = this.jwtService.sign(jwtBody,
          {
             expiresIn: this.configService.get<string>("EXPIRE_ACCESS"),
             secret: this.configService.get<string>("SECRET_ACCESS")
          });

      const userAuthData: Auth = await this.prisma.auth.upsert({
         where: {
            userId: userFromBd.id,
         },
         update: {
            logined: true,
         },
         create: {
            logined: true,
            userId: userFromBd.id,
         },
      });

      return {...userAuthData, accessToken};
   }

   async userLogout(userFromGuard: User): Promise<Auth> {
      const autFromBd: Auth | null = await this.prisma.auth.update({
         where: {
            userId: userFromGuard.id,
         },
         data: {
            logined: false,
         },
      });
      if (!autFromBd) throw new UnauthorizedException({message: "Incorrect token for logout"});
      return autFromBd;
   }

}
