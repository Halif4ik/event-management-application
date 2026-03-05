import {HttpException, HttpStatus, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {User} from "@prisma/client";
import {PrismaService} from "@/prisma.service";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
   private readonly logger: Logger = new Logger(UserService.name);

   constructor(private prisma: PrismaService) {
   }

   async createUser(createUserDto: CreateUserDto): Promise<User> {
      const userInDB = await this.prisma.user.findUnique({
         where: {
            email: createUserDto.email,
         }
      });
      if (userInDB)
         throw new HttpException('User with this e-mail already exist in db', HttpStatus.CONFLICT);

      const newUser: User = await this.prisma.user.create({
         data: {
            email: createUserDto.email,
            fullName: createUserDto.fullName,
            password: await bcrypt.hash(createUserDto.password, 5),
         },
      });

      this.logger.log(`Created new user- ${newUser.id}`);
      return {
         ...newUser,
         password: '',
      }
   }

   async getUserByEmailWithAuth(email: string): Promise<User> {
      const userFromBd = await this.prisma.user.findUnique({
         where: {email},
         include: {Auth: true},
      });
      if (!userFromBd) throw new UnauthorizedException({message: "Incorrect credentials"});
      return userFromBd;
   }

   async getUserByIdCompTargInviteRole(uuid: string): Promise<User | null> {
      return this.prisma.user.findUnique({
         where: {id: uuid},
      });
   }
}

