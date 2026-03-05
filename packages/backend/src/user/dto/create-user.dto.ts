import {IsBoolean, IsEmail, IsOptional, IsPhoneNumber, IsString, Length} from "class-validator";
import {ApiProperty} from '@nestjs/swagger';
import {Transform} from "class-transformer";

export class CreateUserDto {
   @ApiProperty({example: 'temp@gmail.com', description: 'E-mail of user'})
   @IsEmail({}, {message: 'E-mail, should be string'})
   @Length(8, 255, {message: 'E-mail Min length 8 max length 255'})
   readonly email: string;

   @Transform(({value}) => {
      if (value.trim() === '') return null;
      return value;
   })
   @ApiProperty({example: 'Jon Dou', description: 'Name of user'})
   @IsString({message: 'user name, should be string'})
   @Length(2, 255, {message: 'userName Min length 2 max length 255'})
   readonly fullName: string;

   @ApiProperty({example: '123456', description: 'Password of account'})
   @IsString({message: 'Password should be string'})
   @Length(4, 20, {message: 'Password Min lenth 4 max length 20'})
   readonly password: string;
}
