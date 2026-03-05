import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {TransformResponseInterceptor} from "@/interceptor/response.interceptor";
import {GenRespService} from "@/gen-resp/gen-resp.service";
import {GenRespController} from "@/gen-resp/gen-resp.controller";
import { UserModule } from './user/user.module';
import { NotificationModule } from '@/notification/notification.module';
import { AuthModule } from './auth/auth.module';

@Module({
	controllers: [GenRespController],
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.env`,
			isGlobal: true,
		}),
		UserModule,
		NotificationModule,
		AuthModule,
	],
	providers: [GenRespService,{
		provide: APP_INTERCEPTOR,
		useClass: TransformResponseInterceptor,
	},
	],
})
export class AppModule {}
