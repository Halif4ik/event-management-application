import {
   IsBoolean,
   IsEmail,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsPhoneNumber,
   IsString,
   Length,
   Max, Min
} from "class-validator";
import {ApiProperty} from '@nestjs/swagger';
import {Transform} from "class-transformer";
import {CreateUserDto} from "@/user/dto/create-user.dto";

export type VereficationUserDto = Pick<CreateUserDto, 'email' | 'password'>

export class PinDto {
   @IsEmail({}, {message: 'E-mail, should be string'})
   @Length(8, 255, {message: 'E-mail Min length 8 max length 255'})
   readonly email: string;

   @Transform(({value}) => {
      if (parseInt(value)) return value;
      return '';
   })
   @IsString()
   @Length(4, 4, {message: 'Pin should be Number in range 0000-9999'})
   readonly pin: string;
}
