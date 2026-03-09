import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {RequestMethod} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {CorsOptions} from "@nestjs/common/interfaces/external/cors-options.interface";

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   // Define the CORS options
   const corsOptions: CorsOptions = {
      origin: [
         process.env.CORS_HOST_HTTP || 'http://localhost:3030',
      ],
      methods: 'POST,GET,PATCH,DELETE',
      credentials: true, // Enable cookies and authentication headers
   };

   app.enableCors(corsOptions);

   app.setGlobalPrefix('api/v1', {
      exclude: [{ path: '/', method: RequestMethod.GET }],
   });

   const config = new DocumentBuilder()
       .setTitle('Event Management API')
       .setDescription('API for managing events and participants')
       .setVersion('1.0.0')
       .addTag('Event Management')
       .addBearerAuth()
       .build();
   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup(process.env.SWAGGER_HOST || 'api/docs', app, document);

   await app.listen(process.env.PORT ?? 3030);
}

bootstrap();
