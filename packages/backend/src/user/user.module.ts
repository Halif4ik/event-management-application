import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {PrismaService} from "@/prisma.service";
import {EventService} from "@/event/event.service";

@Module({
   controllers: [UserController],
   providers: [UserService, PrismaService, EventService],
   exports:[UserService]
})
export class UserModule {
}
