import {HttpException, HttpStatus, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {User} from "@prisma/client";
import {PrismaService} from "@/prisma.service";
import * as bcrypt from "bcryptjs";
import {PinDto, VereficationUserDto} from "@/user/dto/verefication-user.dto";
import {NotificationService} from "@/notification/notificationService";

@Injectable()
export class UserService {
   private readonly logger: Logger = new Logger(UserService.name);

   constructor(private prisma: PrismaService,
               private notificationService: NotificationService,) {
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
            phoneNumber: createUserDto.phoneNumber,
            shippingAddress: createUserDto.shippingAddress,
            actived: false,
         },
      });

      this.logger.log(`Created new user- ${newUser.id}`);
      return {
         ...newUser,
         password: '',
         pinCode: 0,
      }
   }

   async verefication(vereficationUserDto: VereficationUserDto): Promise<string> {
      const userFromBd: User = await this.getUserByEmail(vereficationUserDto.email);
      const passwordCompare = await bcrypt.compare(vereficationUserDto.password, userFromBd.password);
      if (!passwordCompare) throw new UnauthorizedException({message: "Incorrect credentials"});

      const pin: number = await this.notificationService.emailVerify(vereficationUserDto.email);
      await this.prisma.user.update({
         where: {
            id: userFromBd.id,
         },
         data: {
            pinCode: pin,
         },
      });
      return "Sent";

   }

   async verifyPin(pinDto: PinDto): Promise<User> {
      const userFromBd: User = await this.getUserByEmail(pinDto.email);
      if (+pinDto.pin === userFromBd.pinCode) {
         const updUser = await this.prisma.user.update({
            where: {
               email: pinDto.email,
            },
            data: {
               actived: true,
            },
         });
         return {
            ...updUser,
            password: '',
            pinCode: 0,
         }
      } else throw new UnauthorizedException({message: "Incorrect pin"});
   }

   async getUserByEmailWithAuth(email: string): Promise<User> {
      const userFromBd = await this.prisma.user.findUnique({
         where: {email},
         include: {Auth: true},
      });
      if (!userFromBd) throw new UnauthorizedException({message: "Incorrect credentials"});
      return userFromBd;
   }

   private async getUserByEmail(emailFromDTO: string): Promise<User> {
      const userFromBd = await this.prisma.user.findUnique({
         where: {
            email: emailFromDTO,
         }
      });
      if (!userFromBd) throw new UnauthorizedException({message: "Incorrect credentials"});
      return userFromBd as User;
   }

   async getUserByIdCompTargInviteRole(uuid: string): Promise<User | null> {
      return this.prisma.user.findUnique({
         where: {id: uuid},
      });
   }
}

