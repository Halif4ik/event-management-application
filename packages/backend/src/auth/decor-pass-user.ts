import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {User} from "@prisma/client";
/*get from request where put guard*/
export const UserDec = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

