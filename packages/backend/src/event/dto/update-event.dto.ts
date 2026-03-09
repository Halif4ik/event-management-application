import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsBoolean, IsDateString, Min, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateEventDto {
  @ApiPropertyOptional({
    description: 'Title of the event',
    example: 'Updated Tech Conference 2024',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the event',
    example: 'Updated description for the conference'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Date and time of the event',
    example: '2024-12-25T10:00:00Z'
  })
  @IsOptional()
  @IsDateString()
  dateTime?: string;

  @ApiPropertyOptional({
    description: 'Location where the event will take place',
    example: 'New Conference Center',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of participants (null for unlimited)',
    example: 150,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({
    description: 'Whether the event is public or private',
    example: true,
    default: true
  })
  @IsOptional()
  @Transform(({value}) => value?.toString() === 'true')
  @IsBoolean({message: 'Whether the event is public|true or private|false'})
  isPublic?: boolean;
}
