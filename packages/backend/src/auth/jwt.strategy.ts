import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {ConfigService} from '@nestjs/config';
import {User} from "@prisma/client";
import {TJwtBody} from "@/gen-resp/interface/customResponces";

@Injectable()
export class JwtStrategyAuth extends PassportStrategy(Strategy, "jwt-auth") {
   constructor(private readonly userService: UserService,
               private readonly configService: ConfigService) {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: false,
         secretOrKey: configService.get<string>("SECRET_ACCESS"),

      });
   }

   async validate(payload: unknown): Promise<User | null> {
      if (typeof payload !== 'object' || payload === null) return null;

      // jwt Payload is missing a required property and this point, payload is of type TJwtBody
      const requiredProperties: (keyof TJwtBody)[] = ['uuid', 'email', 'userName','iat','exp'];
      for (const reqProp of requiredProperties) {
         if (!(reqProp in payload)) return null;
      }

      //@ts-ignore
      return this.userService.getUserByIdCompTargInviteRole(payload.uuid);
   }
}