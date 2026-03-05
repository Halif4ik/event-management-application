import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {PrismaService} from "@/prisma.service";
import {NotificationModule} from "@/notification/notification.module";

@Module({
   controllers: [UserController],
   providers: [UserService, PrismaService],
   imports:[
      NotificationModule
   ],
   exports:[UserService]
})
export class UserModule {
}
