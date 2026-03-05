import {Auth} from "@prisma/client";

export type TResponseAuth = Auth & { accessToken: string; };