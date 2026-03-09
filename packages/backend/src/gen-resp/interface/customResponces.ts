import {Event} from "@prisma/client";


export type TJwtBody = {
   uuid: string,
   email: string,
   userName: string,
   iat?: number,
   exp?: number
}

export interface IEvent {
    "event": Event | Event[]
}


