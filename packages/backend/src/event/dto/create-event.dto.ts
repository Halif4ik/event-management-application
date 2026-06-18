import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsBoolean, IsDateString, Min, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({
    description: 'Title of the event',
    example: 'Tech Conference 2024',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Detailed description of the event',
    example: 'A comprehensive tech conference covering latest trends in software development'
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Date and time of the event',
    example: '2024-12-25T10:00:00Z'
  })
  @IsDateString()
  dateTime: string;

  @ApiProperty({
    description: 'Location where the event will take place',
    example: 'Conference Center, Main Hall',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255)
  location: string;

  @ApiPropertyOptional({
    description: 'Maximum number of participants (null for unlimited)',
    example: 100,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;


  @ApiProperty({
    description: 'Whether the event is public or private',
    example: true
  })
  @Transform(({value}) => value?.toString() === 'true')
  @IsBoolean({message: 'Whether the event is public|true or private|false'})
  isPublic: boolean;
}
